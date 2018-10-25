const helper = require("sendgrid").mail;
const sg = require("sendgrid")(
  "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"
);
// (`${process.env.SENDGRID_API_KEY}`);

module.exports = class EmailSender {
  send({ attachment, to, to_name, subject, content, userEmail }) {
    return new Promise((resolve, reject) => {
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

      var request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: mail.toJSON()
      });

      sg.API(request, function(err, response) {
        if (err) reject(err);
        if (response.statusCode > 300) reject(response.body);

        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        resolve(response.body);
      });

      console.log("email is sending...");
    });
  }

  getEmailToAdmin({ csv, budget, deadline, languages, userEmail }) {
    const content = new helper.Content(
      "text/html",
      `<html><body><h3>New incoming translate!</h3><table><tr><td>deadline: ${deadline}</td></tr><tr><td>budget: €${budget}</td></tr><tr><td>from: ${
        languages.from
      }</td></tr><tr><td>to: ${
        languages.to
      }</td></tr><tr><td>user email: < a href="mailto:${userEmail}">${userEmail}</a></td></tr></table></body></html>`
    );
    const to = {
      to: process.env.ADMIN_EMAIL,
      to_name: process.env.ADMIN_EMAIL_NAME
    };
    const subject = `NEW TRANSLATE from ${userEmail} [${languages.from}_${
      languages.to
    }] deadline:[${deadline}] €${budget} `;
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
