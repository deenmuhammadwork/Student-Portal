const express = require('express');
const User = require('../models/Student');
const Teacher = require('../models/Teacher');
const { teacherAuth } = require('../middleware/auth');

const nodemailer = require('nodemailer');
const router = express.Router();


// Get students for a specific teacher's course
router.get('/students', teacherAuth, async (req, res) => {
  try {
    // Debug: Check if teacher object exists
    // console.log('Teacher object:', req.teacher);
    
    if (!req.teacher || !req.teacher.id) {
      return res.status(401).json({ message: 'Teacher authentication required' });
    }

    // console.log('Teacher course:', req.teacher.teacherCourse);
    // console.log('Teacher ID:', req.teacher.id);
    
    // Find students who are approved and enrolled in the teacher's course
    const students = await User.find({
      isApproved: true,
      hasSubmittedAdmissionForm: true,
      $or: [
        { 'admissionForm.courseDetails.mainCategory': req.teacher.teacherCourse },
        { 
          'admissionForm.courseDetails.courseName': { 
            $regex: req.teacher.teacherCourse.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
            $options: 'i' 
          } 
        }
      ]
    }).select('-password');

    // console.log('Found students:', students.length);
    
    // if (students.length > 0) {
    //   console.log('Students details:', students.map(s => ({
    //     name: s.name,
    //     course: s.admissionForm?.courseDetails?.courseName,
    //     mainCategory: s.admissionForm?.courseDetails?.mainCategory,
    //     teacherCourse: req.teacher.teacherCourse
    //   })));
    // }

    res.json(students);
  } catch (err) {
    console.error('Error in teacher route:', err.message);
    res.status(500).send('Server error');
  }
});

// Get teacher profile
router.get('/profile', teacherAuth, async (req, res) => {
  try {
    if (!req.teacher || !req.teacher.id) {
      return res.status(401).json({ message: 'Teacher authentication required' });
    }

    const teacher = await Teacher.findById(req.teacher.id).select('-password');
    res.json(teacher);
  } catch (err) {
    console.error('Error fetching teacher profile:', err.message);
    res.status(500).send('Server error');
  }
});

// Update teacher profile
router.put('/profile', teacherAuth, async (req, res) => {
  try {
    if (!req.teacher || !req.teacher.id) {
      return res.status(401).json({ message: 'Teacher authentication required' });
    }

    const { name, teacherCourse } = req.body;
    
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.teacher.id,
      { name, teacherCourse },
      { new: true }
    ).select('-password');
    
    res.json(updatedTeacher);
  } catch (err) {
    console.error('Error updating teacher profile:', err.message);
    res.status(500).send('Server error');
  }
});

// Send email as teacher
router.post('/send-email', teacherAuth, async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});
module.exports = router;