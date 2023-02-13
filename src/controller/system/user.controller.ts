import { Inject, Controller, Post, Body, ALL, Get } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { ApiResponse } from '@midwayjs/swagger';
import { ErrorCode } from '../../common/error_const';
import { CreateUserDto, PasswordUserDto, UpdatePasswordDto, UpdateUserDto } from '../../dto/system/user.dto';
import { ResOp } from '../../interface';
import { UserService } from '../../service/user.service';
import { ADMIN_PREFIX_URL, BaseController } from '../base.controller';
import { SuccessWrapper } from '../../common/util';

@Controller(`${ADMIN_PREFIX_URL}/user`)
export class UserController extends BaseController {

  @Inject()
  userService: UserService;

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(CreateUserDto)
  })
  @Get('/info', { summary: '获取管理员资料' })
  async info(): Promise<ResOp> {
    return this.utils.res({
      data: await this.userService.getAccountInfo(this.ctx.admin.uid),
    });
  }

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(null)
  })
  @Post('/add', { summary: '新增系统管理员' })
  @Validate()
  async add(@Body(ALL) dto: CreateUserDto): Promise<ResOp> {
    const result = await this.userService.add(dto);
    if (!result) {
      return this.utils.res({ code: ErrorCode.SYSTEM_USER_EXIST });
    }
    return this.utils.res();
  }

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(null)
  })
  @Post('/update', { summary: '更新系统管理员'})
  @Validate()
  async update(@Body(ALL) dto: UpdateUserDto): Promise<ResOp> {
    await this.userService.update(dto);
    // await this.adminSysMenuService.refreshPerms(dto.id);
    return this.utils.res();
  }

  @ApiResponse({
    status: 200,
    type: SuccessWrapper(null)
  })
  @Post('/init-password', { summary: '更改管理员初始密码'})
  @Validate()
  async password(@Body(ALL) dto: PasswordUserDto): Promise<ResOp> {
    await this.userService.forceUpdatePassword(
      this.ctx.admin.uid,
      dto.password
    );
    return this.utils.res();
  }

  @Post('/change-password', { summary: '更改管理员密码'})
  @Validate()
  async updatePassword(@Body(ALL) dto: UpdatePasswordDto): Promise<ResOp> {
    const result = await this.userService.updatePassword(
      this.ctx.admin.uid,
      dto
    );
    if (result) {
      return this.utils.res();
    }
    return this.utils.res({ code: ErrorCode.PASSWORD_NOT_MATCH_ORIGINAL });
  }
}
