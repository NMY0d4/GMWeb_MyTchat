import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { loginSchema } from '@auth/schemes/signin';
import { IResetPasswordParams, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { forgotPasswordTemplate } from '@service/emails/template/forgot-password/forgot-password-template';
import { emailQueue } from '@service/queues/email.queue';
import moment from 'moment';
import publicIP from 'ip';
import { resetPasswordTemplate } from '@service/emails/template/reset-password/reset-password-template';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUSer: IAuthDocument = await authService.getAuthUserByUSername(username);
    if (!existingUSer) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch: boolean = await existingUSer.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUSer._id}`);

    const userJwt: string = Jwt.sign(
      {
        userId: user._id, // ERROR FIX VOIR SECTION 9
        uId: existingUSer.uId,
        email: existingUSer.email,
        username: existingUSer.username,
        avatarColor: existingUSer.avatarColor
      },
      config.JWT_TOKEN!
    );

    ///////////////////////// FOR TESTING EMAIL ////////////////////////////////////

    const templateParams: IResetPasswordParams = {
      username: existingUSer.username,
      email: existingUSer.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: 'arjun.wisoky10@ethereal.email',
      subject: 'Password reset Confirmation'
    });

    req.session = { jwt: userJwt };

    const userDocument: IUserDocument = {
      ...user,
      authId: existingUSer._id,
      username: existingUSer.username,
      email: existingUSer.email,
      avatarColor: existingUSer.avatarColor,
      uId: existingUSer.uId,
      createdAt: existingUSer.createdAt
    } as IUserDocument;

    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
  }
}
