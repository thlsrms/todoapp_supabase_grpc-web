import { GrpcWebFetchTransport, GrpcWebOptions } from '@protobuf-ts/grpcweb-transport';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import {
  SigninPasswordRequest, SigninPasswordResponse, SignupEmailPasswordRequest,
  SignupEmailPasswordResponse, LogoutRequest, LogoutResponse, Credentials, UserToken
} from './generated/auth/v1/auth';
import { AuthenticationClient } from './generated/auth/v1/auth.client';
export { RpcError, UserToken };

export class Auth_v1 {
  private client: AuthenticationClient;
  private webOptions: GrpcWebOptions;

  constructor(accessToken?: UserToken) {
    this.webOptions = {
      baseUrl: 'http://localhost:8080',
      format: "binary",
    };
    if (accessToken !== undefined) {
      this.webOptions.meta = { 'authorization': `Bearer ${accessToken.value}` }
    }
    const transport = new GrpcWebFetchTransport(this.webOptions);
    this.client = new AuthenticationClient(transport);
  }

  async signinPassword(input: SigninPasswordRequest): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async signupEmailPassword(email: string, password: string): Promise<UserToken | RpcError> {
    const signupRequest = SignupEmailPasswordRequest.create({
      credentials: Credentials.toBinary({ email, password }),
    });

    try {
      const signupResponse = await this.client.signupEmailPassword(signupRequest);
      return signupResponse.response.token
    } catch (error) {
      return error as RpcError;
    }

  }

  async logout(input: LogoutRequest): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
