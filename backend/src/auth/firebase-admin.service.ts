import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      throw error;
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      throw error;
    }
  }

  async createUser(
    email: string,
    password: string
  ): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().createUser({
        email,
        password,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    uid: string,
    data: admin.auth.UpdateRequest
  ): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().updateUser(uid, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
    } catch (error) {
      throw error;
    }
  }

  // 소셜 로그인 사용자 생성/업데이트
  async createOrUpdateSocialUser(
    provider: string,
    providerData: {
      uid: string;
      email: string;
      displayName?: string;
      photoURL?: string;
    }
  ): Promise<admin.auth.UserRecord> {
    try {
      const user = await this.getUserByEmail(providerData.email);
      if (user) {
        // 기존 사용자 업데이트
        return this.updateUser(user.uid, {
          displayName: providerData.displayName,
          photoURL: providerData.photoURL,
          emailVerified: true,
        });
      } else {
        // 새 사용자 생성
        return this.createUser(
          providerData.email,
          Math.random().toString(36).slice(-8)
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // 이메일로 사용자 조회
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
    try {
      return await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return null;
      }
      throw error;
    }
  }

  // 사용자 커스텀 클레임 설정
  async setCustomClaims(uid: string, claims: object): Promise<void> {
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
    } catch (error) {
      throw error;
    }
  }
}
