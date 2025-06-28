# Implementation Guide: Expandable Forms for Training Profile Categories

## 🎯 Overview
This guide shows how to **convert the current navigation-based profile system to expandable forms**. Currently, the profile system uses `RadioGroupOfCards` that navigate to separate pages when clicked. This guide shows how to implement in-place expandable forms instead.

## 🔍 Current Implementation Analysis
**File**: `ProfileContainer.tsx`
**Current Behavior**: 
- Uses `RadioGroupOfCards` component for category display
- Clicking cards triggers `navigate(/dashboard/profile/${selected.id})` 
- Forms open on separate pages via routing
- Uses `<Outlet />` to render child route components

**Current Architecture**:
```
ProfileContainer.tsx (Grid View)
     ↓ (Navigation)
AttributeDetailPage.tsx (Wrapper) 
     ↓ 
AttributeForm.tsx (Individual Form)
```

## 🚨 Prerequisites
Before implementing this feature, ensure the [critical profile issues](./README.md#🚨-critical-issues-deployment-blockers) are resolved first:
- ✅ Console.log statements removed
- ✅ Real validation logic implemented  
- ✅ Context performance optimized

## 📋 Current Implementation Status
- ❌ **No expandable forms exist** - All categories currently navigate to separate pages
- ✅ **Navigation system works** - Cards properly navigate to individual form pages
- ❌ **Expandable form functionality** - Needs complete implementation

## 🔧 Implementation Steps

### Step 1: Add Expandable State Management
**File**: `ProfileContainer.tsx`
**Add new state** (around line 24):

```javascript
// Add after existing state declarations
const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
```

### Step 2: Create New Click Handler
**File**: `ProfileContainer.tsx`
**Replace the existing navigation logic** in the `onChange` handler (around lines 109-115):

**Current Code**:
```javascript
onChange={(selected: SelectableItem | SelectableItem[]) => {
  // Navigate to the selected attribute page
  if (!Array.isArray(selected)) {
    // For single selection, navigate to the attribute page
    navigate(`/dashboard/profile/${selected.id}`);
  }
}}
```

**New Code**:
```javascript
onChange={(selected: SelectableItem | SelectableItem[]) => {
  if (!Array.isArray(selected)) {
    const categoryId = selected.id.toString();
    // Toggle expandable forms instead of navigation
    if (expandedCategory === categoryId) {
      setExpandedCategory(null); // Close if already open
    } else {
      setExpandedCategory(categoryId); // Open selected category
    }
  }
}}
```

### Step 3: Create Inline Form Rendering
**File**: `ProfileContainer.tsx`
**Replace the `<Outlet />` section** (around lines 118-120):

**Current Code**:
```javascript
<div>
  <Outlet />
</div>
```

**New Code**:
```javascript
{/* Expandable Form Section */}
{expandedCategory && (
  <div className="mt-6">
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <AttributeFormProvider>
        <AttributeForm 
          attributeTypeId={expandedCategory}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </AttributeFormProvider>
    </div>
  </div>
)}
```

### Step 4: Add Form Event Handlers
**File**: `ProfileContainer.tsx`
**Add these handlers** (after the existing useEffect hooks):

```javascript
// Handle form save - close expanded form and show feedback
const handleFormSave = () => {
  setExpandedCategory(null);
  // Optional: Add success toast/notification
  console.log("Form saved successfully!");
};

// Handle form cancel - just close the expanded form
const handleFormCancel = () => {
  setExpandedCategory(null);
};
```

### Step 5: Update AttributeForm Component
**File**: `src/modules/dashboard/profile/components/AttributeForm.tsx`
**Modify the component signature and button actions** (around lines 14-16):

**Current Signature**:
```typescript
export function AttributeForm({
  attributeTypeId,
}: {
  attributeTypeId: string;
}) {
```

**New Signature**:
```typescript
export function AttributeForm({
  attributeTypeId,
  onSave,
  onCancel,
}: {
  attributeTypeId: string;
  onSave?: () => void;
  onCancel?: () => void;
}) {
```

**Update form submission** (around lines 74-78):
```javascript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  setSaveError(null);
  setSaveSuccess(false);

  try {
    // ... existing submission logic ...
    await promptService.submitPromptValues(promptValues);
    refetch();
    setSaveSuccess(true);
    
    // Call the onSave callback if provided
    if (onSave) {
      setTimeout(() => onSave(), 1000); // Delay to show success message
    }
  } catch (error) {
    // ... existing error handling ...
  } finally {
    setIsSaving(false);
  }
};
```

**Update the Cancel button** (around lines 184-186):
```javascript
// Replace the Link with a button
<button
  type="button"
  onClick={onCancel || (() => {})}
  className="btn"
>
  Cancel
</button>
```

### Step 6: Add Required Imports
**File**: `ProfileContainer.tsx`
**Add to imports** (around lines 1-12):

```javascript
// Add this import
import { AttributeFormProvider } from "@/contexts/AttributeFormContext";
import { AttributeForm } from "./components/AttributeForm";
```

### Step 7: Update Visual Selection State
**File**: `ProfileContainer.tsx`
**Modify the RadioGroupOfCards selected prop** (around line 85):

**Current Code**:
```javascript
selected={defaultSelected}
```

**New Code**:
```javascript
selected={expandedCategory ? 
  attributeTypes.find(type => type.id.toString() === expandedCategory) && {
    id: expandedCategory,
    title: attributeTypes.find(type => type.id.toString() === expandedCategory)?.name || '',
    description: attributeTypes.find(type => type.id.toString() === expandedCategory)?.description || ''
  } : 
  undefined
}
```

## 🎯 Key Behavior Changes

### 1. **Navigation → Expansion**
- **Before**: Click card → Navigate to new page
- **After**: Click card → Expand form inline

### 2. **Single Expansion**
- ✅ Only one category can be expanded at a time
- ✅ State managed by `expandedCategory` variable

### 3. **Toggle Functionality**  
- ✅ Clicking an already expanded category closes it
- ✅ Clicking a different category switches to that one

### 4. **Form Integration**
- ✅ Reuses existing `AttributeForm` component
- ✅ Maintains all current form functionality
- ✅ Preserves validation and saving logic

### 5. **Save/Cancel Behavior**
- ✅ After saving, form closes and returns to grid view
- ✅ Cancel button closes form without saving
- ✅ Success feedback before closing

## 📊 Architecture Comparison

### Current (Navigation-Based)
```
ProfileContainer.tsx
├── RadioGroupOfCards (displays categories)
├── Navigate to /dashboard/profile/:id
└── <Outlet /> renders:
    └── AttributeDetailPage.tsx
        └── AttributeFormProvider
            └── AttributeForm.tsx
```

### New (Expandable Forms)
```
ProfileContainer.tsx
├── RadioGroupOfCards (displays categories)
├── expandedCategory state
├── Conditional rendering:
│   └── AttributeFormProvider
│       └── AttributeForm.tsx (inline)
└── No routing needed
```

## 🔧 State Management Implementation

### State Structure
```javascript
// In ProfileContainer.tsx
const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

// State values:
// null = no category expanded
// "1" = category with id "1" is expanded  
// "2" = category with id "2" is expanded, etc.
```

### Form Integration
```javascript
// The AttributeForm component remains largely unchanged
// Just adds optional callback props for better integration
interface AttributeFormProps {
  attributeTypeId: string;
  onSave?: () => void;     // NEW: Called after successful save
  onCancel?: () => void;   // NEW: Called when user cancels
}
```

## 🧪 Testing Checklist

- [ ] All attribute type cards can be clicked to expand
- [ ] Only one category expands at a time
- [ ] Clicking expanded category closes it
- [ ] Form validation works in expanded mode
- [ ] Save button works and closes form
- [ ] Cancel button closes form without saving
- [ ] Form data persists correctly
- [ ] Completion percentages update after save
- [ ] Responsive design works on mobile
- [ ] No console errors after implementation

## ⚠️ Migration Considerations

### 1. **Routing Impact**
- Individual attribute routes (`/dashboard/profile/:id`) will no longer be used
- Consider if deep linking to specific attributes is needed
- Update any bookmarks or direct links

### 2. **URL State**
- Current implementation maintains URL state for selected attributes
- New implementation loses URL state (only in-memory)
- Consider adding URL params to maintain expandedCategory state

### 3. **Back Button Behavior**
- Current: Back button navigates between form and grid
- New: Back button navigates away from entire profile page
- Consider adding browser history management if needed

### 4. **Mobile Experience**
- Expanded forms will take full width on mobile
- Consider scroll behavior when forms expand
- Test keyboard navigation and accessibility

## 🔗 Related Documentation
- **[Profile System README](./README.md)** - Critical issues and deployment status
- **[Context API Patterns](../../../docs/code-review/standards/context-patterns.md)** - Performance optimization
- **[Form Validation Guide](../../../docs/code-review/by-feature/profile-forms/README.md)** - Validation patterns

## 📝 Implementation Notes

### Priority Order
1. **Fix critical issues first** (see README.md)
2. **Implement basic expansion** for all categories using existing AttributeForm
3. **Test thoroughly** to ensure no regression in form functionality
4. **Enhance user experience** with animations and feedback
5. **Consider URL state preservation** if deep linking is important

### Code Organization
- Reuse existing `AttributeForm` component with minimal changes
- Keep form validation and submission logic unchanged
- Add optional callback props for better integration
- Maintain existing context providers and state management

---

*This guide converts the current navigation-based profile system to expandable forms while preserving all existing functionality. Implement after resolving the [critical deployment blockers](./README.md#🚨-deployment-status)* 