"use client";

import React, { useState, ReactNode } from "react";
import { ActionButton } from "../ActionButton";
import { Body } from "../Typography";
import classNames from "classnames";

export interface Step {
  id: string | number;
  title: string;
  description?: string;
  content: ReactNode;
  validator?: () => boolean | Promise<boolean>;
}

export interface MultiStepFormProps {
  steps: Step[];
  onComplete: () => void;
  onCancel?: () => void;
  nextButtonText?: string;
  backButtonText?: string;
  completeButtonText?: string;
  cancelButtonText?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function MultiStepForm({
  steps,
  onComplete,
  onCancel,
  nextButtonText = "Next",
  backButtonText = "Back",
  completeButtonText = "Complete",
  cancelButtonText = "Cancel",
  isSubmitting = false,
  className = "",
}: MultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNext = async () => {
    const currentStep = steps[currentStepIndex];

    if (currentStep.validator) {
      const isValid = await currentStep.validator();
      if (!isValid) return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className={classNames("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        {currentStep.title && (
          <div className="mb-2">
            <h3 className="text-lg font-medium">{currentStep.title}</h3>
            {currentStep.description && (
              <Body className="text-[var(--black-300)]">
                {currentStep.description}
              </Body>
            )}
          </div>
        )}

        <div>{currentStep.content}</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-3 h-5">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={classNames(
                "rounded-full transition-all duration-300",
                {
                  "w-2 h-2 bg-[var(--white)]": index === currentStepIndex,

                  "w-1 h-1 bg-[var(--white)]": index < currentStepIndex,

                  "w-1 h-1 bg-[var(--black-200)]": index > currentStepIndex,
                }
              )}
              aria-current={index === currentStepIndex ? "step" : undefined}
            ></span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <ActionButton
            variant="gray"
            onClick={isFirstStep ? handleCancel : handleBack}
            leftIcon={false}
          >
            {isFirstStep ? cancelButtonText : backButtonText}
          </ActionButton>

          <ActionButton
            variant="white"
            onClick={handleNext}
            leftIcon={false}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : isLastStep
              ? completeButtonText
              : nextButtonText}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
