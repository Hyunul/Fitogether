import { Handler } from "aws-lambda";
import * as admin from "firebase-admin";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const handler: Handler = async (event) => {
  try {
    const token = event.authorizationToken?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    // Firebase 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);

    return {
      principalId: decodedToken.uid,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    };
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Unauthorized");
  }
};
