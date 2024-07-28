import {Body, Controller, Get, HostParam, HttpCode, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Public} from 'nest-keycloak-connect';
import {OnboardCompanyService} from '../domain/onboard.company.service';
import {OnboardCompanyReqDto, OnboardCompanyResDto} from '../dto/onboard.dto';

@ApiTags('Onboard-company')
@Controller('onboard-company')
@Public()
export class OnboardController {
    constructor(private readonly onboardCompanyService: OnboardCompanyService) {
    }

    @Get('/index')
    @HttpCode(HttpStatus.OK)
    async helloIndex() {
        return this.createResponse('Hello Onboard Company Index', "OK")
    }

    @Get('/users/:user_id')
    @HttpCode(HttpStatus.OK)
    async findUserCompany(@Param('user_id') user_id: string) {
        let data = await this.onboardCompanyService.findOneByUserId(user_id);
        return this.createResponse(data, "OK")
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findByCompanyName(@Query('company_name') company_name: string) {
        let data = await this.onboardCompanyService.findOneByCompanyName(company_name);
        return this.createResponse(data, "OK")
    }

    @Get('/company-type')
    @HttpCode(HttpStatus.OK)
    async getCompanyTypes() {
        let data = await this.onboardCompanyService.getActiveCompanyTypes();
        return this.createResponse(data, "OK")
    }

    @Get('/liquidate-unit')
    @HttpCode(HttpStatus.OK)
    async getLiquidateUnit() {
        let data = await this.onboardCompanyService.getActiveLiquidateUnits();
        return this.createResponse(data, "OK")
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCompany(@Body() request: OnboardCompanyReqDto) {
        let data = await this.onboardCompanyService.onboardNewCompany(request);
        return this.createResponse(data, "CREATED")
    }

    private createResponse(data: OnboardCompanyResDto | any, status_code: string) {
        return {
            status_code: status_code,
            message: "",
            data: data
        }
    }
}
