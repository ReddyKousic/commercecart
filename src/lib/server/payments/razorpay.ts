import {RAZORPAY_SECRET } from '$env/static/private';
import { PUBLIC_RAZORPAY_ID } from '$env/static/public';
import Razorpay from 'razorpay';
export var instance = new Razorpay({
	key_id: PUBLIC_RAZORPAY_ID,
	key_secret: RAZORPAY_SECRET
});

