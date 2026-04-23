# HR Workflow Designer

A production-quality HR workflow designer built with React, TypeScript, and React Flow. This application allows HR administrators to visually create, configure, and simulate workflows for processes like employee onboarding, approval workflows, and automated HR tasks.

## 🚀 Features

### Core Functionality
- **Visual Workflow Designer**: Drag-and-drop interface for creating workflows
- **5 Node Types**: Start, Task, Approval, Automated, and End nodes
- **Dynamic Configuration**: Schema-based forms for node configuration
- **Real-time Validation**: Continuous workflow validation with error feedback
- **Workflow Simulation**: Test workflows with step-by-step execution logs
- **Export/Import**: Save and load workflows as JSON files

### Technical Highlights
- **Clean Architecture**: Separation of concerns with modular design
- **Strong TypeScript**: Full type safety with discriminated unions
- **Scalable State Management**: Zustand store with proper typing
- **Schema-driven Forms**: Extensible form engine for node configuration
- **Mock API Layer**: Realistic backend simulation with async handling
- **Component Reusability**: Custom hooks and utility functions

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── canvas/         # React Flow canvas
│   ├── nodes/          # Custom node components
│   ├── forms/          # Dynamic form components
│   └── panels/         # UI panels (sidebar, configuration, simulation)
├── hooks/              # Custom React hooks
├── store/             # Zustand state management
├── services/          # API services and mock backend
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (validation, serialization)
```

### Key Architectural Decisions

#### 1. Schema-Driven Forms
Instead of hardcoding forms for each node type, we implemented a schema-based form system:
- **Benefits**: Easy to add new node types, consistent validation, maintainable code
- **Implementation**: `FormSchema.ts` defines field configurations, `DynamicForm.tsx` renders them

#### 2. Clean State Management
Used Zustand over Redux for simplicity while maintaining scalability:
- **Benefits**: Less boilerplate, TypeScript-friendly, performant
- **Structure**: Single store with actions and selectors, separation of UI state

#### 3. Type-Safe Node System
Implemented discriminated unions for node data:
```typescript
export type WorkflowNodeData = 
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;
```

#### 4. Modular Validation Engine
Created a comprehensive validation system that checks:
- Workflow structure (start/end nodes, connections)
- Node configurations (required fields, valid values)
- Graph integrity (cycles, disconnected nodes)

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Workflow Engine**: React Flow
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage Guide

### Creating a Workflow

1. **Add Nodes**: Drag node types from the left sidebar to the canvas
2. **Connect Nodes**: Click and drag from node handles to create connections
3. **Configure Nodes**: Click on any node to open the configuration panel
4. **Validate**: Real-time validation shows errors and warnings
5. **Test**: Use the simulation panel to test workflow execution
6. **Export**: Save your workflow as JSON for later use

### Node Types

#### Start Node
- **Purpose**: Begin the workflow
- **Configuration**: Title, metadata fields
- **Rules**: Only one per workflow, no incoming connections

#### Task Node
- **Purpose**: Manual tasks requiring human action
- **Configuration**: Title, description, assignee, due date, custom fields
- **Examples**: Document review, form completion

#### Approval Node
- **Purpose**: Require approval from specified roles
- **Configuration**: Title, approver role, auto-approval threshold
- **Behavior**: Can auto-approve based on vote count

#### Automated Node
- **Purpose**: Execute automated actions
- **Configuration**: Action selection, dynamic parameters
- **Available Actions**: Send email, generate documents, create tickets, Slack notifications

#### End Node
- **Purpose**: Conclude the workflow
- **Configuration**: Title, end message, summary toggle
- **Rules**: No outgoing connections

### Workflow Validation

The system continuously validates workflows and provides feedback on:
- **Missing Components**: Start/end nodes required
- **Connection Issues**: Invalid connections, disconnected nodes
- **Configuration Errors**: Missing required fields
- **Structural Problems**: Cycles, unreachable nodes

### Simulation

Test your workflow with realistic execution:
- **Step-by-step execution** with timing
- **Error simulation** for edge cases
- **Performance metrics** and execution logs
- **Success/failure reporting**

## 🔧 Development

### Adding New Node Types

1. **Update Types**: Add new node type to `NodeType` enum
2. **Create Node Component**: Add to `components/nodes/`
3. **Update Form Schema**: Add configuration in `forms/FormSchema.ts`
4. **Register Node**: Update `WorkflowCanvas.tsx` nodeTypes
5. **Add Validation**: Update `utils/validation.ts`

### Custom API Integration

Replace the mock API in `services/api.ts`:
```typescript
export class WorkflowApiService {
  static async getAutomations(): Promise<Automation[]> {
    // Replace with real API call
    return fetch('/api/automations').then(res => res.json());
  }
  
  static async simulateWorkflow(request: SimulationRequest): Promise<SimulationResponse> {
    // Replace with real API call
    return fetch('/api/simulate', {
      method: 'POST',
      body: JSON.stringify(request)
    }).then(res => res.json());
  }
}
```

### Styling Customization

The application uses Tailwind CSS with a custom design system:
- **Colors**: Defined in `tailwind.config.js`
- **Components**: Consistent styling patterns
- **Themes**: Easy to customize color schemes

## 📊 Performance Considerations

### Optimizations Implemented
- **React Flow**: Efficient rendering of large graphs
- **State Management**: Selective subscriptions prevent unnecessary re-renders
- **Validation**: Debounced validation to prevent performance issues
- **Code Splitting**: Components loaded on demand

### Scalability Features
- **Modular Architecture**: Easy to extend functionality
- **Type Safety**: Prevents runtime errors
- **Clean Separation**: UI, state, and business logic separated
- **Reusable Components**: Custom hooks and utilities

## 🧪 Testing

### Manual Testing Checklist
- [ ] Drag and drop nodes from sidebar
- [ ] Connect nodes with edges
- [ ] Configure each node type
- [ ] Test workflow validation
- [ ] Run workflow simulation
- [ ] Export/import workflows
- [ ] Test error handling
- [ ] Verify responsive design

### Future Testing Plans
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API services
- E2E tests with Playwright

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api.com
VITE_APP_VERSION=1.0.0
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with proper typing
4. Add tests if applicable
5. Submit pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Consistent formatting
- **Components**: Functional components with hooks
- **Types**: No `any` types unless necessary

## 📝 Future Enhancements

### Planned Features
- [ ] **Real-time Collaboration**: Multiple users editing workflows
- [ ] **Advanced Analytics**: Workflow performance metrics
- [ ] **Template Library**: Pre-built workflow templates
- [ ] **Conditional Logic**: Branching workflows based on conditions
- [ ] **Integration Hub**: Connect to external HR systems
- [ ] **Mobile Support**: Responsive design for tablets
- [ ] **Undo/Redo**: History management for workflow edits
- [ ] **Mini-map**: Better navigation for large workflows

### Technical Improvements
- [ ] **Performance**: Virtual scrolling for large workflows
- [ ] **Accessibility**: WCAG compliance improvements
- [ ] **Internationalization**: Multi-language support
- [ ] **Testing**: Comprehensive test suite
- [ ] **Documentation**: API documentation and guides

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Flow**: Excellent workflow diagramming library
- **Zustand**: Simple and powerful state management
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

---

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the code examples for implementation guidance

**Built with ❤️ for HR professionals**
