import {Body, Controller, Get, HostParam, HttpCode, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Public} from 'nest-keycloak-connect';
import {OnboardCompanyService} from '../domain/onboard.company.service';
import {CompanyInterestReqDto, OnboardCompanyReqDto, OnboardCompanyResDto} from '../dto/onboard.dto';
import {CompanyInterestService} from '../domain/company.interest.service';

@ApiTags('Onboard-company')
@Controller('onboard-company')
@Public()
export class OnboardController {
    constructor(
        private readonly onboardCompanyService: OnboardCompanyService,
        private companyInterestService: CompanyInterestService,
    ) {
    }

    @Get('/index')
    @HttpCode(HttpStatus.OK)
    async helloIndex() {
        return this.createResponse('Hello Onboard Company Index', 'OK');
    }

    @Get('/users/:user_id')
    @HttpCode(HttpStatus.OK)
    async findUserCompany(@Param('user_id') user_id: string) {
        let data = await this.onboardCompanyService.findOneByUserId(user_id);
        return this.createResponse(data, 'OK');
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findByCompanyName(@Query('company_name') company_name: string) {
        let data = await this.onboardCompanyService.findOneByCompanyName(company_name);
        return this.createResponse(data, 'OK');
    }

    @Get('/company-type')
    @HttpCode(HttpStatus.OK)
    async getCompanyTypes() {
        let data = await this.onboardCompanyService.getActiveCompanyTypes();
        return this.createResponse(data, 'OK');
    }

    @Get('/category')
    @HttpCode(HttpStatus.OK)
    async getCategory() {
        let data = await this.onboardCompanyService.getCategories();
        return this.createResponse(data, 'OK');
    }

    @Get('/order-volume')
    @HttpCode(HttpStatus.OK)
    async getOrderVolumes() {
        let data = await this.onboardCompanyService.getOrderVolumes();
        return this.createResponse(data, 'OK');
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCompany(@Body() request: OnboardCompanyReqDto) {
        let data = await this.onboardCompanyService.onboardNewCompany(request);
        return this.createResponse(data, 'CREATED');
    }

    @Post('/:company_id/interest')
    @HttpCode(HttpStatus.CREATED)
    async createCompanyInterest(@Param('company_id') company_id: string, @Body() request: CompanyInterestReqDto) {
        request.company_id = company_id;
        return this.companyInterestService.createCompanyInterest(request);
    }

    @Get('/:company_id/interest')
    @HttpCode(HttpStatus.OK)
    async getCompanyInterest(@Param('company_id') company_id: string) {
        let data = await this.companyInterestService.getCompanyInterest(company_id);
        return this.createResponse(data, 'OK');
    }

    private createResponse(data: OnboardCompanyResDto | any, status_code: string) {
        if (data) {
        }
        return {
            status_code: status_code,
            message: '',
            data: data,
        };
    }
}
