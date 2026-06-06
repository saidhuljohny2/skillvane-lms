
# Skillvane Free Domain + Hosting

The app is ready for static hosting on Vercel. Use the existing GitHub repo:

https://github.com/saidhuljohny2/skillvane-lms.git

## 1. Deploy On Vercel

1. Login to Vercel.
2. Import the GitHub repository above.
3. Use these project settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Deploy the project.

If using Razorpay, add these in Vercel Project Settings > Environment Variables:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
VITE_RAZORPAY_KEY
```

## 2. Claim A Free Domain

DigitalPlat FreeDomain requires a personal account and WHOIS/contact details, so this step must be completed by the domain owner.

1. Register at `https://dash.domain.digitalplat.org/auth/register`.
2. Claim one of these Skillvane-friendly names if available:
   - `skillvane.dpdns.org`
   - `skillvane.us.kg`
   - `skillvane.qzz.io`
   - `skillvane.xx.kg`
   - `skillvane.qd.je`
3. Enable WHOIS privacy in the DigitalPlat dashboard if available.

## 3. Connect DNS To Vercel

After the Vercel deployment is live:

1. In Vercel, open Project Settings > Domains.
2. Add the claimed domain, for example `skillvane.dpdns.org`.
3. Add the DNS record Vercel shows.

Common Vercel records:

```text
Type: CNAME
Name: skillvane
Value: cname.vercel-dns.com
```

If Vercel asks for an apex record instead:

```text
Type: A
Name: @
Value: 76.76.21.21
```

Wait for DNS propagation, then Vercel will issue HTTPS automatically.
