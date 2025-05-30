import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("인증 토큰이 필요합니다.");
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = await this.firebaseAdminService.verifyToken(token);
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        provider: decodedToken.firebase?.sign_in_provider || "password",
        name: decodedToken.name,
        picture: decodedToken.picture,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
