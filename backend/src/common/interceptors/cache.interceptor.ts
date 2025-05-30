import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, any>();
  private readonly ttl = 60000; // 1분

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);

    // GET 요청이 아닌 경우 캐시를 건너뜁니다
    if (request.method !== "GET") {
      return next.handle();
    }

    const cachedResponse = this.cache.get(key);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, data);
        // TTL 후에 캐시 삭제
        setTimeout(() => {
          this.cache.delete(key);
        }, this.ttl);
      })
    );
  }

  private generateCacheKey(request: any): string {
    const { url, method, params, query } = request;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(
      query
    )}`;
  }
}
