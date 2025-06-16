const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendJobStatusNotification = async (userEmail, jobDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Job Application Status Update: ${jobDetails.company}`,
    html: `
      <h2>Job Application Status Update</h2>
      <p>Your job application status has been updated:</p>
      <ul>
        <li><strong>Company:</strong> ${jobDetails.company}</li>
        <li><strong>Role:</strong> ${jobDetails.role}</li>
        <li><strong>New Status:</strong> ${jobDetails.status}</li>
        <li><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>Login to your dashboard to view more details.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};

const sendNewApplicationNotification = async (userEmail, jobDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `New Job Application Added: ${jobDetails.company}`,
    html: `
      <h2>New Job Application Added</h2>
      <p>You have added a new job application:</p>
      <ul>
        <li><strong>Company:</strong> ${jobDetails.company}</li>
        <li><strong>Role:</strong> ${jobDetails.role}</li>
        <li><strong>Status:</strong> ${jobDetails.status}</li>
        <li><strong>Applied Date:</strong> ${new Date(jobDetails.appliedDate).toLocaleDateString()}</li>
      </ul>
      <p>Login to your dashboard to manage your application.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New application email sent successfully');
  } catch (error) {
    console.error('Error sending new application email:', error);
    throw error;
  }
};

module.exports = {
  sendJobStatusNotification,
  sendNewApplicationNotification
}; 