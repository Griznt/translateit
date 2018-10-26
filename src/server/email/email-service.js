const helper = require("sendgrid").mail;
const Sendgrid = require("sendgrid");

module.exports = class EmailSender {
  send({ attachment, to, to_name, subject, content, userEmail }) {
    // return new Promise((resolve, reject) => {
    const mail = new helper.Mail();
    let email = new helper.Email(
      process.env.SITE_EMAIL,
      process.env.SITE_EMAIL_NAME
    );
    mail.setFrom(email);

    mail.setSubject(subject);

    const personalization = new helper.Personalization();
    email = new helper.Email(to, to_name ? to_name : to);
    personalization.addTo(email);
    mail.addPersonalization(personalization);

    mail.addContent(content);
    if (attachment) mail.addAttachment(attachment);
    const sendgrid = new Sendgrid(process.env.SENDGRID_API_KEY);
    var request = sendgrid.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: mail.toJSON()
    });

    console.log("email is sending...");
    return sendgrid.API(request);
  }

  getEmailToAdmin({ csv, budget, deadline, languages, userEmail }) {
    const content = new helper.Content(
      "text/html",
      `<html><body><h3>New incoming translate!</h3><table><tr><td>deadline: ${deadline}</td></tr><tr><td>budget: €${budget}</td></tr><tr><td>from: ${
        languages.from
      }</td></tr><tr><td>to: ${
        languages.to
      }</td></tr><tr><td>user email: <a href="mailto:${userEmail}">${userEmail}</a></td></tr></table></body></html>`
    );
    const to = {
      to: process.env.ADMIN_EMAIL,
      to_name: process.env.ADMIN_EMAIL_NAME
    };
    const subject = `New Translation from  CLIENT ${userEmail} ${
      languages.from
    } > ${languages.to} DEADLINE ${deadline} FEE EUR ${budget} `;
    const attachment = new helper.Attachment();

    const base64File = new Buffer(csv).toString("base64");
    attachment.setContent(base64File);
    attachment.setType("text/csv");
    attachment.setFilename(`${languages.from}_${languages.to}.csv`);
    attachment.setDisposition("attachment");

    return {
      subject,
      ...to,
      content,
      attachment
    };
  }
};
