export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type Fact = {
  __typename?: 'Fact';
  fact: Scalars['String'];
  length?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  content?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createItem?: Maybe<Item>;
  deleteItem?: Maybe<Scalars['Boolean']>;
  login: User;
  singleUpload: File;
  updateItem?: Maybe<Item>;
};


export type MutationCreateItemArgs = {
  content: Scalars['String'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSingleUploadArgs = {
  file?: InputMaybe<Scalars['Upload']>;
};


export type MutationUpdateItemArgs = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  writerId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getAllItems?: Maybe<Array<Maybe<Item>>>;
  getFact: Fact;
  item?: Maybe<Item>;
  postsByWriterId: Array<Maybe<Post>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  writerById?: Maybe<Writer>;
};


export type QueryItemArgs = {
  id: Scalars['ID'];
};


export type QueryPostsByWriterIdArgs = {
  writerId: Scalars['ID'];
};


export type QueryWriterByIdArgs = {
  id: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Unknown = 'UNKNOWN',
  User = 'USER'
}

export type Task = {
  __typename?: 'Task';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Scalars['String'];
  token: Scalars['String'];
  username: Scalars['String'];
};

export type Writer = {
  __typename?: 'Writer';
  id: Scalars['ID'];
  writerEmail?: Maybe<Scalars['String']>;
};
