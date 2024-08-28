import {IsNotEmpty} from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    country_code: number;

    @IsNotEmpty()
    phone_no: number;

    @IsNotEmpty()
    pollen_pass_id: number;
}
