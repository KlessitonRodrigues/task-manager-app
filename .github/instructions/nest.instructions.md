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

// Must always implement a typed interface — never skip the interface

```typescript
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
}
```

// Must always wrap database operations in try-catch returning ErrorDto on failure

```typescript
async findOne(id: number): Promise<GetUserResponseDto | ErrorDto> {
  try {
    const user = await this.userRepository.findOneBy({ id });
    return GetUserResponseDto.create(user);
  } catch (error) {
    const details = error instanceof Error ? error.message : error;
    return ErrorDto.create({ details, ...apiMessage.FIND_USER_ERROR });
  }
}
```

// Must always use union return types: PromisedDTO | ErrorDto

```typescript
async create(dto: CreateUserDto): Promise<GetUserResponseDto | ErrorDto>
```

## Controllers

// Must use private readonly for injected services in constructor

```typescript
constructor(private readonly userService: UserService) {}
```

// Must apply @UsePipes(ZodValidationPipe) on routes that receive a @Body()

```typescript
@Post()
@UsePipes(ZodValidationPipe)
async create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

// Must return service results directly — no extra wrapping in controllers

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

## DTOs

// Must use nestjs-zod — define a shared schema object and derive DTOs from it

```typescript
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

// Must use static .create() factory method for instantiating response DTOs

```typescript
return GetUserResponseDto.create(user);
```

## Entities

// Must declare table name explicitly in @Entity()
// Must use @CreateDateColumn() and @UpdateDateColumn() for timestamps — never manage them manually

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

// Must be integration tests using axios against a real running API — no mocking
// Must throw early if BASE_URL env variable is not configured
// Must to certify that data created in tests will be deleted in the cleanup test, even if a test fails
// Must to include all code and constants inside the test "describe()" block
// Must to create instances of DTOs from feature.dto.ts to mock data

```typescript
const baseURL = dotenv.BASE_URL;
if (!baseURL) throw new Error("missing BASE_URL");
const apiClient = axios.create({ baseURL });
```

// Must use randomUUID() to generate unique test data, preventing collisions between runs

```typescript
const testId = randomUUID().replace(/-/g, "");
const createUserDto: CreateUserDto = {
  name: `John Doe ${testId}`,
  email: `john${testId}@email.com`,
  password: "password123",
};
```

// Must follow the full CRUD lifecycle in order: create → list → get → update → delete
// Must persist the created resource ID in a `let` variable shared across tests

```typescript
let createdUserId: number;

it("should create a new user and return 201 status", async () => {
  const response = await apiClient.post("/users", createUserDto);
  expect(response.status).toBe(201);
  createdUserId = response.data.id;
});
```

// Must verify response shapes using toMatchObject (partial match) and toEqual (exact match)

```typescript
expect(response.data).toMatchObject({
  id: createdUserId,
  name: createUserDto.name,
});
expect(response.data).toEqual({ ...apiMessage.DELETED_SUCCESSFULLY });
```

// Must include a validation test that sends invalid data and expects a 400 response

```typescript
it("should return 400 status for invalid user data", async () => {
  await expect(apiClient.post("/users", invalidDto)).rejects.toMatchObject({
    response: { status: 400 },
  });
});
```

// Must always include a cleanup test as the final case to remove any leftover test data

```typescript
it("should clean up any test data", async () => {
  if (!createdUserId) return;
  await apiClient.delete(`/users/${createdUserId}`).catch(() => undefined);
});
```

## Swagger 2.0 Synchronization

// Must always update <repository>/swagger-2.0.yaml when changing any Nest API surface
// Keep swagger-2.0.yaml in sync for every change in:
// - modules (<feature>.module.ts) that expose/add/remove controllers
// - controllers (routes, params, request/response shapes, status codes)
// - DTOs/entities that affect request/response contracts
// - code of error and success responses that affect x-api-response-codes
// Include path updates, body/path parameter updates, response updates, and related x-api-response-codes updates
