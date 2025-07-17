# AI-Powered Newsletter

This is a full-stack newsletter signup system that allows users to subscribe via a web form and receive dynamic, AI-generated email content based on their selected topics. The system is designed for scalability, email deliverability, and modern UX.

---

## Features

- **Email Confirmation Workflow**: Users confirm their email via a secure tokenized link.
- **Welcome Email**: Beautifully styled welcome email sent after confirmation.
- **AI-Generated Newsletters** (Upcoming):
  - Personalized content using OpenAI APIs.
  - Subscribers choose topics of interest (e.g. tech, health, productivity).
  - Generated content is relevant, high-quality, and curated weekly.
- **Pub/Sub Architecture**:
  - Decouples user signup from email delivery.
  - Uses Google Cloud Pub/Sub (mockable via DI) for event publishing.
- **Resend Integration**:
  - Used to send transactional emails (welcome + confirmation).
  - Fully decoupled via a `MailerService` interface.
- **Prisma ORM**:
  - Manages subscriber data in a relational database (PostgreSQL/MySQL).
  - `upsertSubscriber()` ensures idempotent signups.
- **Dependency Injection Architecture**:
  - Clean separation of concerns.
  - Easy to swap services like Mailer, Pub/Sub, DB clients.

---

## Tech Stack

| Layer      | Tech                              |
|-----------|------------------------------------|
| Frontend  | Vite + React + Tailwind CSS        |
| Backend   | Node.js + Express.js               |
| DB        | Prisma ORM + MySQL/Postgres        |
| Email     | [Resend](https://resend.com/) API  |
| AI Engine | OpenAI API (GPT)                   |
| Events    | Google Cloud Pub/Sub               |
| Hosting   | Render / Vercel / Cloud Run        |

---

## Email Templates

Emails are styled to be clean and modern, with support for branding, hover effects, and responsive layouts.

- `renderWelcomeEmail()` — Sent after signup confirmation.
- `renderConfirmationEmail(link)` — Token-based confirmation prompt.
- Templates use inline styles for cross-client compatibility.

---

## Folder Structure

```
.
├── src/
│   ├── email-templates/       # HTML email render functions
│   ├── services/
│   │   ├── resend/            # Mailer service implementation
│   │   ├── pubsub/            # PubSub service interface
│   │   └── newsletter.ts      # Signup/upsert logic
│   ├── handlers/              # Express route handlers
│   └── utils/                 # Constants, validation
├── prisma/                    # Prisma schema & migrations
├── .env                       # Environment configs
```

---

## Environment Variables

Add these in a `.env` file:

```env
RESEND_API_KEY=your_resend_key
RESEND_SENDER=Your Brand <team@yourdomain.com>
APP_URL=https://your-app-url.com
```

---

## Example Signup Flow

1. User visits frontend and enters email.
2. Backend validates email and upserts subscriber.
3. A Pub/Sub message is published with user email + token.
4. A subscriber (worker or listener) handles the event and:
   - Sends a confirmation email via Resend.
5. Upon clicking the confirmation link:
   - The token is verified.
   - The user receives a welcome email.
   - Future newsletters are tailored to their topic selections.

---

## AI Newsletter (Planned)

- Users select preferred topics during or after signup.
- The backend runs a scheduled job (e.g. weekly cron):
  - Pulls user preferences.
  - Queries AI for summaries, trends, or tips.
  - Compiles content into an HTML email.
- Emails are personalized and engaging.

---

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run local
```

3. (Optional) Generate Prisma client:

```bash
npx prisma generate
```

4. (Optional) Push schema:

```bash
npx prisma db push
```

---

## ✨ Future Enhancements

- User dashboard to manage preferences and topics.
- Admin panel to view engagement.
- Scheduled newsletter queue system.
- Redis cache for topic content or rate-limiting.
- User authentication (Magic Link or OAuth).

---

## 📬 Author

Built by **Yasseen Hilal**  
UT Austin | CS Student

---
