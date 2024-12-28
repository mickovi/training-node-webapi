import {
  ValidationRequirements,
  ValidationRule,
  WebServiceValidation,
  ModelValidation,
} from "./validation_types";
import validator from "validator";

// The ValidationRule named intValidator describes validation for integer values,
// with a validation property that uses the validator package to ensure a value is
// an integer and a converter function that parses the value to a number.
const intValidator: ValidationRule = {
  validation: [(val) => validator.isInt(val.toString())],
  converter: (val) => Number.parseInt(val),
};

// The intValidator is used on its own as the key validator and in the ValidationRequirements
// object named partialResultValidator, which validates the name, age, and years properties that
// are required by the store method. The validation requirements for the replace method extend those
// used by the store method by adding a nextage property.
const partialResultValidator: ValidationRequirements = {
  name: [(val) => !validator.isEmpty(val)],
  age: intValidator,
  years: intValidator,
};

// The ResultWebServiceValidation object defines the keyValidator, store, and
// replace properties, which indicates that the web service requires its ID values
// to be validated, as well as the data used by the store and replace methods.
export const ResultWebServiceValidation: WebServiceValidation = {
  keyValidator: intValidator,
  store: partialResultValidator,
  replace: {
    ...partialResultValidator,
    nextage: intValidator,
  },
};

export const ResultModelValidation: ModelValidation = {
  propertyRules: { ...partialResultValidator, nextage: intValidator },
  modelRule: [(m: any) => m.nextage === m.age + m.years],
};
