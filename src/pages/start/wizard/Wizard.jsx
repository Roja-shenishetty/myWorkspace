import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stepper, Step, StepLabel, Paper } from "@mui/material";

export function Wizard({ steps, onSubmit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [wizardData, setWizardData] = useState({}); // unified data store
  const [errors, setErrors] = useState({});

  const isLastStep = activeStep === steps.length;

  const handleDataChange = (stepName, stepData) => {
    setWizardData(prev => ({
      ...prev,
      [stepName]: { ...prev[stepName], ...stepData }
    }));
  };

  const validateStep = () => {
    const step = steps[activeStep];
    if (step && step.validation) {
      const stepData = wizardData[step.stepName] || {};
      const validationErrors = step.validation(stepData);
      setErrors(validationErrors || {});
      return Object.keys(validationErrors || {}).length === 0;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(s => s + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(wizardData);
  };

  const CurrentComponent = activeStep < steps.length ? steps[activeStep].component : null;
  const currentStepName = steps[activeStep]?.stepName || "";

  useEffect(() => {
    // For debugging current data state
    console.log("Wizard Data:", wizardData);
  }, [wizardData]);

  return (
    <Box maxWidth="600px" margin="auto" p={3}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => (
          <Step key={step.stepNumber}>
            <StepLabel>{step.stepName}</StepLabel>
          </Step>
        ))}
        <Step key="review">
          <StepLabel>Review</StepLabel>
        </Step>
      </Stepper>

      <Paper variant="outlined" sx={{ mt: 3, p: 3 }}>
        {activeStep < steps.length && CurrentComponent && (
          <CurrentComponent
            data={wizardData[currentStepName] || {}}
            onChange={stepData => handleDataChange(currentStepName, stepData)}
            errors={errors}
            {...(steps[activeStep].props || {})}
          />
        )}

        {isLastStep && <ReviewStep data={wizardData} />}

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          {isLastStep ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function ReviewStep({ data }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review your submission
      </Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
