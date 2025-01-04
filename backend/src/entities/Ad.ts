import { IsEmail, IsUrl, Length, Max, Min } from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Field, ID, Float, ObjectType, InputType } from "type-graphql";
import { IdInput } from "./Id";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field()
    title!: string;

    @Column()
    @Field()
    description!: string;

    @Column()
    @Field()
    location!: string;

    @Column()
    @IsEmail()
    @Field()
    owner!: string;

    @Column()
    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float)
    price!: number;

    @Column("simple-array") // Stocke un tableau sous forme de chaîne séparée par des virgules
    @IsUrl({}, { each: true }) // Valide que chaque élément est une URL valide
    @Field(() => [String]) // GraphQL retourne un tableau de chaînes
    picture!: string[];

    @CreateDateColumn()
    @Field()
    createdAt!: Date;

    @ManyToOne(() => Category, (category) => category.ads)
    @Field(() => Category, { nullable: true })
    category!: Category;

    @ManyToMany(() => Tag)
    @JoinTable()
    @Field(() => [Tag])
    tags!: Tag[];
}

@InputType()
export class createAdInput {
    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    location!: string;

    @IsEmail()
    @Field()
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float)
    price!: number;

    @IsUrl({}, { each: true }) // Valide que chaque élément du tableau est une URL valide
    @Field(() => [String]) // Tableau de chaînes dans GraphQL
    picture!: string[];

    @Field(() => IdInput, { nullable: true })
    category!: IdInput;

    @Field(() => [IdInput], { nullable: true })
    tags!: IdInput[];
}

@InputType()
export class updateAdInput {
    @Field(() => IdInput, { nullable: true })
    category!: IdInput;

    @Field(() => [IdInput], { nullable: true })
    tags!: IdInput[];

    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field({ nullable: true })
    title!: string;

    @Field({ nullable: true })
    description!: string;

    @Field({ nullable: true })
    location!: string;

    @IsEmail()
    @Field({ nullable: true })
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float, { nullable: true })
    price!: number;

    @IsUrl({}, { each: true }) // Valide que chaque élément du tableau est une URL valide
    @Field(() => [String], { nullable: true }) // Tableau de chaînes dans GraphQL
    picture!: string[];
}