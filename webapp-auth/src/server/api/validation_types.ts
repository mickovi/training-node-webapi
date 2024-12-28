// The WebServiceValidation type describes the validation requirements
// for a web service.
export interface WebServiceValidation {
  // The keyValidator property specifies the validation requirements for the
  // ID values that identify data records, using the ValidationRule type.
  keyValidator?: ValidationRule;
  getMany?: ValidationRequirements;
  store?: ValidationRequirements;
  replace?: ValidationRequirements;
  modify?: ValidationRequirements;
}

// ValidationRequirements object can specify the shape of the object expected by
// the web service, and a ValidationRule for each of them.
export type ValidationRequirements = {
  [key: string]: ValidationRule;
};

// A ValidationRule can either be an array of test functions that will be
// applied to a value, or an object that additionally specifies whether a value
// is required and a converter that will transform the value into the type expected
// by the web service method.
export type ValidationRule =
  | ((value: any) => boolean)[]
  | {
      required?: boolean;
      validation: ((value: any) => boolean)[];
      converter?: (value: any) => any;
    };

// The ValidationError class represents a problem validating the data sent by the
// client in a request.
export class ValidationError implements Error {
  constructor(public name: string, public message: string) {}
  stack?: string | undefined;
  cause?: unknown;
}

// 
export type ModelValidation = {
  modelRule?: ValidationRule;
  propertyRules?: ValidationRequirements;
};
