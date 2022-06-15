import { MinLength } from "class-validator";

export default class TypeMeasureDTO{

    @MinLength(1)
    public id?: string;
    public type?: string;
}