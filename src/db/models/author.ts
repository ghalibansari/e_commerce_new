import { Model, Optional, DataTypes } from 'sequelize';
import { DB } from '../../configs/DB';
import Book from './book';

interface AuthorAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface AuthorCreationAttributes
    extends Optional<AuthorAttributes, 'id'> { }

interface AuthorInstance
    extends Model<AuthorAttributes, AuthorCreationAttributes>,
    AuthorAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}


const Author = DB.define<AuthorInstance>(
    'Author',
    {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        firstName: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        lastName: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        email: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
    }
);


Author.hasMany(Book, {
    /*
      You can omit the sourceKey property
      since by default sequelize will use the primary key defined
      in the model - But I like to be explicit 
    */
    sourceKey: 'id',
    foreignKey: 'authorId',
    as: 'books'
  });


  export default Author;