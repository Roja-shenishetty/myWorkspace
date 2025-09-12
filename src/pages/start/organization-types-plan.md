# Organization Types Configuration Plan

This document outlines the plan for creating a new configuration file for organization types that will be used with the HorizontalIconButtonGrid component, similar to the existing user-type.config.jsx.

## Organization Types

1. School
2. University
3. Training Institute
4. Coaching Center
5. Society / Colony
6. Virtual School
7. Religious Institute
8. Company
9. Family Group
10. School Alumnus

## Configuration Structure

The configuration will follow the same structure as user-type.config.jsx:

```javascript
export const organizationTypeItems = [
  {
    title: "Organization Type Name",
    id: "unique-identifier",
    description: "Brief description of the organization type",
    svg: (
      // SVG icon component
    )
  },
  // ... more items
];
```

## Implementation Steps

1. Create appropriate SVG icons for each organization type
2. Write descriptive text that clearly explains each organization type
3. Implement the configuration file following the existing pattern
4. Ensure the file is properly exported for use in other components

## Organization Details

### 1. School
- **Icon**: School building icon
- **Description**: For managing educational institutions providing primary and secondary education

### 2. University
- **Icon**: Academic cap or university building icon
- **Description**: For managing higher education institutions offering undergraduate and postgraduate programs

### 3. Training Institute
- **Icon**: Workshop or skills icon
- **Description**: For managing specialized institutions providing professional training and skill development

### 4. Coaching Center
- **Icon**: Books or tutoring icon
- **Description**: For managing educational centers providing exam preparation and academic support

### 5. Society / Colony
- **Icon**: Community or residential building icon
- **Description**: For managing residential communities, housing societies, and local associations

### 6. Virtual School
- **Icon**: Laptop or online education icon
- **Description**: For managing online educational institutions providing remote learning experiences

### 7. Religious Institute
- **Icon**: Place of worship icon (generic)
- **Description**: For managing religious organizations and spiritual educational institutions

### 8. Company
- **Icon**: Office building or business icon
- **Description**: For managing corporate organizations and business entities

### 9. Family Group
- **Icon**: Family or group of people icon
- **Description**: For managing family units and small private groups for personal organization

### 10. School Alumnus
- **Icon**: Graduation cap or alumni network icon
- **Description**: For managing school alumni associations and graduate networks

## Next Steps

1. Switch to Code mode to implement the actual JSX configuration file
2. Create the organization-types.config.jsx file with the defined organization types
3. Implement appropriate SVG icons for each type
4. Add descriptive text for each organization type