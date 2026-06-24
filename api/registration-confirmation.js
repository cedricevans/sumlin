import { buildRegistrationEmail, getAuthorizedAdminData, sendResendEmail } from './_email.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ ok: false, message: 'Method not allowed' });
		return;
	}

	const { registrationId, slug = 'sumlin' } = req.body || {};
	if (!registrationId) {
		res.status(400).json({ ok: false, message: 'Missing registrationId' });
		return;
	}

	try {
		const adminData = await getAuthorizedAdminData(req.headers.authorization, slug);
		const registration = (adminData.reunionRegistrations || []).find((r) => r.id === registrationId);

		if (!registration) {
			res.status(404).json({ ok: false, message: 'Registration not found' });
			return;
		}

		const emailPayload = buildRegistrationEmail({ registration, tenant: adminData.tenant });
		const result = await sendResendEmail(emailPayload);

		res.status(200).json({ ok: true, message: 'Email sent', emailId: result?.id || null });
	} catch (error) {
		console.error('registration-confirmation error', error);
		res.status(500).json({ ok: false, message: error.message || 'Unable to send the email right now.' });
	}
}
