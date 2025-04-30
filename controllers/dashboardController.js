const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const BlockRequest = require('../models/blockRequestModel');

exports.getCardMetrics = async (req, res) => {
    const { user_type, school, range } = req.query;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    // Calculate date range based on the range parameter
    let startDate;
    const currentDate = new Date();

    switch (range) {
        case '12 Months':
            startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
            break;
        case '30 Days':
            startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
            break;
        case '7 Days':
            startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            break;
        case '24 Hours':
            startDate = new Date(currentDate.setHours(currentDate.getHours() - 24));
            break;
        case 'All Date':
        default:
            startDate = new Date(0); // Start from the Unix epoch
            break;
    }

    try {
        let total_students;
        let late_early_leave;
        let blocked_sites;
        let pending_requests;

        // Total Students
        if (user_type === 'super_admin') {
            total_students = await User.countDocuments({
                type: 'student',
                createdAt: { $gte: startDate }
            });
        } else {
            total_students = await User.countDocuments({
                type: 'student',
                school,
                createdAt: { $gte: startDate }
            });
        }

        // Late/Early Leave
        if (user_type === 'super_admin') {
            late_early_leave = await Session.countDocuments({
                $or: [{ tardy: true }, { early_leave: true }],
                start_time: { $gte: startDate }
            });
        } else {
            late_early_leave = await Session.countDocuments({
                school,
                $or: [{ tardy: true }, { early_leave: true }],
                start_time: { $gte: startDate }
            });
        }

        // Blocked Sites
        if (user_type === 'super_admin') {
            blocked_sites = await BlockRequest.countDocuments({
                status: 'approved',
                createdAt: { $gte: startDate }
            });
        } else {
            blocked_sites = await BlockRequest.countDocuments({
                school,
                status: 'approved',
                createdAt: { $gte: startDate }
            });
        }

        // Pending Requests
        if (user_type === 'super_admin') {
            pending_requests = await BlockRequest.countDocuments({
                status: 'pending',
                createdAt: { $gte: startDate }
            });
        } else {
            pending_requests = await BlockRequest.countDocuments({
                school,
                status: 'pending',
                createdAt: { $gte: startDate }
            });
        }

        res.json({
            total_students,
            late_early_leave,
            blocked_sites,
            pending_requests
        });
    } catch (error) {
        console.log('Error fetching card metrics:', error);
        res.status(500).send('Error fetching card metrics');
    }
};

exports.getTrends = async (req, res) => {
    const { user_type, school, year } = req.query;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }
    
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded) {
    //     return res.status(401).json({ status: 'error', message: 'Invalid token' });
    // }

    if (!year) {
        return res.status(400).json({ status: 'error', message: 'Year is required' });
    }

    try {
        const attendanceData = [];

        // Loop through each month
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0); // Last day of the month

            // Find unique students for attendance
            let uniqueStudents;
            if (user_type === 'super_admin') {
                uniqueStudents = await Session.distinct('student', {
                    start_time: { $gte: startDate, $lte: endDate }
                });
            } else {
                uniqueStudents = await Session.distinct('student', {
                    school,
                    start_time: { $gte: startDate, $lte: endDate }
                });
            }

            const attendanceCount = uniqueStudents.length;

            // Find total students for absence calculation
            let totalStudents;
            if (user_type === 'super_admin') {
                totalStudents = await User.countDocuments({ type: 'student' });
            } else {
                totalStudents = await User.countDocuments({ type: 'student', school });
            }

            const absentCount = totalStudents - attendanceCount;

            // Push the result for the month
            attendanceData.push({
                month: startDate.toLocaleString('default', { month: 'long' }), // Get month name
                attendance: attendanceCount,
                absent: absentCount
            });
        }

        res.json(attendanceData);
    } catch (error) {
        console.log('Error fetching trends:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching trends' });
    }
};

exports.getViolations = async (req, res) => {
    const { user_type, school, year } = req.query;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    if (!year) {
        return res.status(400).json({ status: 'error', message: 'Year is required' });
    }

    try {
        const matchCriteria = {
            start_time: {
                $gte: new Date(year, 0, 1), // Start of the year
                $lte: new Date(year, 11, 31) // End of the year
            },
            student: { $ne: null } // Ensure that the student field is not null
        };

        if (user_type !== 'super_admin') {
            matchCriteria.school = school; // Filter by school for non-super_admin
        }

        // Aggregate to find early leaves and tardy counts
        const violations = await Session.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: '$student',
                    early_leaves: { $sum: { $cond: [{ $eq: ['$early_leave', true] }, 1, 0] } },
                    tardy: { $sum: { $cond: [{ $eq: ['$tardy', true] }, 1, 0] } }
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming the user model is named 'User'
                    localField: '_id',
                    foreignField: '_id',
                    as: 'student_info'
                }
            },
            {
                $unwind: '$student_info'
            },
            {
                $project: {
                    _id: 0,
                    student_name: { $concat: ['$student_info.full_name', ''] }, // Assuming full_name is the field for student name
                    student_id: '$student_info.student_id', // Assuming student_id is a field in the User model
                    early_leaves: 1,
                    tardy: 1,
                    total_violations: { $add: ['$early_leaves', '$tardy'] }
                }
            },
            { $sort: { total_violations: -1 } }, // Sort by total violations
            { $limit: 5 } // Get top 5 students
        ]);

        // Format the output with rank
        const formattedViolations = violations.map((violation, index) => ({
            rank: index + 1,
            student_name: violation.student_name,
            student_id: violation.student_id,
            early_leaves: violation.early_leaves,
            tardy: violation.tardy
        }));

        res.json(formattedViolations);
    } catch (error) {
        console.log('Error fetching violations:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching violations' });
    }
};
