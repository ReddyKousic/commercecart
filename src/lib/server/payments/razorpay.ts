import { RAZORPAY_ID, RAZORPAY_SECRET } from '$env/static/private';
import Razorpay from 'razorpay';
export var instance = new Razorpay({
	key_id: RAZORPAY_ID,
	key_secret: RAZORPAY_SECRET
});

