import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

/**
        {
  exp: 1705508272,
  iat: 1705506592,
  auth_time: 1705506591,
  jti: 'b51e5fee-cb96-44eb-ae75-74d5c8100d60',
  iss: 'http://localhost:8080/realms/asn-project',
  aud: 'account',
  sub: '93047f95-231f-4c89-b4f8-b90d25ddfe73',
  typ: 'Bearer',
  azp: 'account-console',
  nonce: '8691f098-ee9c-4acb-9471-0ec41e42776d',
  session_state: 'bb1bebd7-5822-450a-8876-918b02ef140c',
  acr: '1',
  resource_access: { account: { roles: [Array] } },
  scope: 'openid email profile',
  sid: 'bb1bebd7-5822-450a-8876-918b02ef140c',
  email_verified: false,
  name: 'Rana Ansar',
  preferred_username: 'asn',
  given_name: 'Rana',
  family_name: 'Ansar',
  email: 'asn.cs21@gmail.com'
}
 */
