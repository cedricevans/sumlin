import { buildOrderEmail, getAuthorizedAdminData, sendResendEmail } from './_email.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ ok: false, message: 'Method not allowed' });
		return;
	}

	const { orderId, slug = 'sumlin', variant = 'payment-confirmed' } = req.body || {};
	if (!orderId) {
		res.status(400).json({ ok: false, message: 'Missing orderId' });
		return;
	}

	try {
		const adminData = await getAuthorizedAdminData(req.headers.authorization, slug);
		const order = (adminData.orders || []).find((item) => item.id === orderId);

		if (!order) {
			res.status(404).json({ ok: false, message: 'Order not found' });
			return;
		}

		const tickets = (adminData.tickets || []).filter((ticket) => ticket.order_id === orderId);
		const emailPayload = buildOrderEmail({
			order,
			tickets,
			tenant: adminData.tenant,
			variant,
		});

		const result = await sendResendEmail(emailPayload);

		res.status(200).json({
			ok: true,
			message: 'Email sent',
			emailId: result?.id || null,
		});
	} catch (error) {
		console.error('resend-confirmation error', error);
		res.status(500).json({
			ok: false,
			message: error.message || 'Unable to send the email right now.',
		});
	}
}
