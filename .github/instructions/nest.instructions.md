---
description: NestJS coding rules for TypeScript projects
globs: apps/api/**/*.ts
---

> **Document format:** Each section targets a specific file type. Rules appear as `// comment`
> lines above code blocks — follow them exactly unless there is clear justification to deviate.
> Code examples use the `user` feature as reference; substitute your own feature name throughout.
> All import paths are relative to the package root.

# NestJS Coding Rules

## Folder Structure

// Each feature lives under src/modules/<feature>/ with this layout

```
src/
├── main.ts
├── app.module.ts
├── constants/
│   └── dotenv.ts               # env variable accessors
├── database/
│   └── database.module.ts      # TypeORM connection setup
└── modules/
    ├── common/
    │   └── dto/
    │       └── apiResponse.ts  # shared ErrorDto and response DTOs
    ├── docs/
    │   ├── swegger.module.ts
    │   ├── swagger.controller.ts
    │   └── swagger.service.ts
    └── <feature>/
        ├── <feature>.module.ts
        ├── <feature>.controller.ts
        ├── <feature>.service.ts
        ├── <feature>.spec.ts
        ├── dto/
        │   └── <feature>.dto.ts
        └── entity/
            └── <feature>.entity.ts
```

// Never place entity or dto files outside their feature folder
// Tests live alongside the module files, not in a separate **tests** directory

## Modules

// Always declare imports, controllers, and providers explicitly

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## Services

// Always implement a typed interface — never skip the interface

```typescript
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
}
```

// Always wrap database operations in try-catch returning ErrorDto on failure
// Always use union return types: PromisedDTO | ErrorDto

```typescript
import { apiMessage } from 'constants/apiMessage';

async findOne(id: number): Promise<GetUserResponseDto | ErrorDto> {
  try {
    const user = await this.userRepository.findOneBy({ id });
    return GetUserResponseDto.create(user);
  } catch (error) {
    const details = error instanceof Error ? error.message : error;
    return ErrorDto.create({ details, ...apiMessage.FIND_USER_ERROR });
  }
}

async create(dto: CreateUserDto): Promise<GetUserResponseDto | ErrorDto>
```

## Controllers

// Use private readonly for injected services in constructor
// Apply @UsePipes(ZodValidationPipe) on routes that receive a @Body()
// Return service results directly — no extra wrapping in controllers

```typescript
constructor(private readonly userService: UserService) {}

@Post()
@UsePipes(ZodValidationPipe)
async create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

## DTOs

// Use nestjs-zod — define a shared schema object and derive DTOs from it
// Use createZodDto() to derive DTOs from zod schemas
// Use DTOs for request and response shapes — never use entities directly in controllers
// Use `.partial()` for update DTOs — never duplicate field definitions
// Use static `.create()` factory method for instantiating response DTOs

```typescript
import { createZodDto } from 'utils/zod';
import { z } from 'zod';

const userSchema = {
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8),
};

export class CreateUserDto extends createZodDto(z.object(userSchema)) {}
export class PatchUserDto extends createZodDto(
  z.object({ ...userSchema }).partial(),
) {}
```

```typescript
return GetUserResponseDto.create(user);
```

## Entities

// Declare table name explicitly in @Entity()
// Use @CreateDateColumn() and @UpdateDateColumn() for timestamps — never manage them manually

```typescript
@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

## Tests

// Integration tests only — use axios against a real running API, no mocking
// Throw early if `BASE_URL` env variable is not configured
// Always clean up data created in tests, even if earlier tests fail
// Include all code and constants inside the `describe()` block
// Create DTO instances from feature.dto.ts to mock data
// Use randomUUID() to generate unique test data, preventing collisions between runs
// Follow the full CRUD lifecycle in order: create → list → get → update → delete
// Persist the created resource ID in a `let` variable shared across tests
// Verify response shapes using toMatchObject (partial match) and toEqual (exact match)
// Include a validation test that sends invalid data and expects a 400 response
// Always include a cleanup test as the final case to remove any leftover test data

```typescript
import { apiMessage } from 'constants/apiMessage';

describe('Users API', () => {
  const baseURL = dotenv.BASE_URL;
  if (!baseURL) throw new Error("missing BASE_URL");
  const apiClient = axios.create({ baseURL });

  const testId = randomUUID().replace(/-/g, "");
  const createUserDto: CreateUserDto = {
    name: `John Doe ${testId}`,
    email: `john${testId}@email.com`,
    password: "password123",
  };

  let createdUserId: number;

  it("should create a new user and return 201 status", async () => {
    const response = await apiClient.post("/users", createUserDto);
    expect(response.status).toBe(201);
    createdUserId = response.data.id;
  });

  it("should return the created user", async () => {
    const response = await apiClient.get(`/users/${createdUserId}`);
    expect(response.data).toMatchObject({
      id: createdUserId,
      name: createUserDto.name,
    });
  });

  it("should delete a user and return success message", async () => {
    const response = await apiClient.delete(`/users/${createdUserId}`);
    expect(response.data).toEqual({ ...apiMessage.DELETED_SUCCESSFULLY });
  });

  it("should return 400 status for invalid user data", async () => {
    await expect(apiClient.post("/users", { name: "" })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it("should clean up any test data", async () => {
    if (!createdUserId) return;
    await apiClient.delete(`/users/${createdUserId}`).catch(() => undefined);
  });
});
```

## Swagger 2.0 Synchronization

// Always update <repository>/swagger-2.0.yaml when changing any Nest API surface
// Keep swagger-2.0.yaml in sync for every change in:
// - modules (<feature>.module.ts) that expose/add/remove controllers
// - controllers (routes, params, request/response shapes, status codes)
// - DTOs/entities that affect request/response contracts
// - code of error and success responses that affect x-api-response-codes
// Include path updates, body/path parameter updates, response updates, and related x-api-response-codes updates
