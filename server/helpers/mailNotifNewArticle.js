require('dotenv').config()
const sgMail = require('@sendgrid/mail');

function mailNotifNewArticle(subscribers, author, newArticle){
    if(subscribers.length > 0){
        let emails = []
        subscribers.forEach(subscriber => {
            emails.push(subscriber.email)
        });
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: emails,
            from: 'admin@blog.ndiw.com',
            subject: `Artikel Baru dari ${author}`,
            text: `Haii.. ${author} membuat artikel baru berjudul ${newArticle.title}, ayo baca biar ga kudet :) http://blog.ndiw.online/articles/${newArticle._id} ayo meng-kopi-kan Nusantara dengan kopi-kopi lokal`,
            html: `
            <p>Haii.. ${author} membuat artikel baru berjudul ${newArticle.title}, ayo baca biar ga kudet :) ayo meng-kopi-kan Nusantara dengan kopi-kopi lokal</p>
            <form action=http://blog.ndiw.online/articles/${newArticle._id}>
                <input type="submit" value="Baca Artikel" />
            </form> `,
        };
        sgMail.sendMultiple(msg);    
    }
}

module.exports = mailNotifNewArticle
