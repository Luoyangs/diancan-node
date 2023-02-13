import { Inject, Controller, ALL, Get, Query, Post, Body } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { ApiResponse } from '@midwayjs/swagger';
import { isEmpty } from 'lodash';
import { ResOp } from '../../interface';
import { NOPERM_PREFIX_URL, BaseController } from '../base.controller';
import { ImageCaptchaReqDto, ImageCaptchaRespDto, LoginInfoDto, LoginRespDto } from '../../dto/common.dto';
import { CommonService } from '../../service/common.service';
import { SuccessWrapper } from '../../common/util';
import { ErrorCode } from '../../common/error_const';

@Controller(`${NOPERM_PREFIX_URL}`)
export class LoginController extends BaseController {

  @Inject()
  commonService: CommonService;

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(ImageCaptchaRespDto)
  })
  @Get('/captcha/img', { summary: '获取图片验证码'})
  @Validate()
  async captchaByImg(
    @Query(ALL) captcha: ImageCaptchaReqDto
  ): Promise<ResOp> {
    const result = await this.commonService.getImgCaptcha(captcha);
    return this.utils.res({ data: result });
  }

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(LoginRespDto)
  })
  @Post('/login', { summary: '管理员登录' })
  @Validate()
  async login(@Body(ALL) loginInfo: LoginInfoDto): Promise<ResOp> {
    const isSuccess = await this.commonService.checkImgCaptcha(
      loginInfo.captchaId,
      loginInfo.verifyCode
    );
    if (!isSuccess) {
      return this.utils.res({ code: ErrorCode.INPUT_CAPTCHA_ERROR });
    }
    const sign = await this.commonService.getLoginSign(
      loginInfo.username,
      loginInfo.password
    );
    if (isEmpty(sign)) {
      return this.utils.res({ code: ErrorCode.USERNAME_OR_PASSWORD_ERROR });
    }
    return this.utils.res({ data: { token: sign } });
  }

}
