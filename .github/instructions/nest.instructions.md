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
// Tests live alongside the module files, not in a separate __tests__ directory

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
export class PatchUserDto extends createZodDto(z.object({ ...userSchema }).partial()) {}
```

// Must use static .create() factory method for instantiating response DTOs
```typescript
return GetUserResponseDto.create(user);
```

## Entities

// Must declare table name explicitly in @Entity()
// Must use @CreateDateColumn() and @UpdateDateColumn() for timestamps — never manage them manually
```typescript
@Entity('users')
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
