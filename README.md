
  # GCP Data Engineering Course Website

  This is a code bundle for GCP Data Engineering Course Website. The original project is available at https://www.figma.com/design/oQ8npXeNhT6EyrRwyC9JAe/GCP-Data-Engineering-Course-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Automated restricted Google Drive access

  Deploy `scripts/google-drive-enrollment.gs` as an Apps Script web app that executes as the automation account. Add a Script Property named `DRIVE_WEBHOOK_SECRET`, then configure the same secret and deployment URL in Vercel as `GOOGLE_DRIVE_ACCESS_SECRET` and `GOOGLE_DRIVE_ACCESS_WEBHOOK_URL`. Every mapped course folder must grant that automation account Editor access, including folders owned by another Google account. Verified payments and admin-granted enrollments will then add the student's registered Google email as a Viewer of the matching restricted course folder.
