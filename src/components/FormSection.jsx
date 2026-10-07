/**
 * FormSection Component
 * Container for intake form sections
 */

import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

export function FormSection({
  title,
  subtitle = null,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  currentSection = 1,
  totalSections = 5,
  showBackButton = true,
  loadingNext = false,
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
        <ProgressBar current={currentSection} total={totalSections} />
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-meridian-teal mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>

        {/* Form content */}
        <div className="space-y-6">{children}</div>
      </div>

      {/* Footer with navigation */}
      <div className="border-t border-gray-100 px-6 py-6 bg-white">
        <div className="max-w-2xl mx-auto flex gap-4 justify-between">
          {showBackButton ? (
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="primary"
            onClick={onNext}
            disabled={nextDisabled}
            loading={loadingNext}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
