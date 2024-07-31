// Define the database structure using DBML (Database Markup Language)
// Documentation: https://dbml.dbdiagram.io/docs

// Table to store user login information
Table UserLogins {
  login_id bigint [primary key, increment] // Unique identifier for the login
  username varchar(255) // Username for the login
  password varchar(255) // Password for the login
  status bool // Indicates if the login is active or inactive
  created_at timestamp // Timestamp indicating when the record was created
  updated_at timestamp // Timestamp indicating when the record was last updated
}

// Table to store user details
Table Users {
  user_id bigint [primary key, increment] // Unique identifier for the user
  cpf varchar(11) [unique] // User's CPF (Cadastro de Pessoas Físicas) - unique identifier in Brazil
  name varchar(255) // Full name of the user
  birth_date date // User's birth date
  address_id bigint [unique] // Unique identifier for the user's address
  is_active bool // Indicates if the user is active or inactive
}

// Table to record user audit logs
Table UserAuditLogs {
  audit_id bigint [primary key, increment] // Unique identifier for the audit record
  user_id bigint // Identifier of the user associated with the action
  action_type_id bigint // Identifier of the type of action performed
  action_timestamp timestamp // Timestamp indicating when the action was performed
  login_id bigint // Identifier of the login user who performed the action
}

// Table to define types of actions performed
Table ActionTypes {
  action_type_id bigint [primary key, increment] // Unique identifier for the action type
  action_type varchar(50) [note: "create, update, delete"] // Type of action (e.g., create, update, delete)
}

// Table to store address details
Table Addresses {
  address_id bigint [primary key, increment] // Unique identifier for the address
  street text // Street name of the address
  house_number varchar(255) // House number of the address
  complement text // Additional address details (optional)
  neighborhood text // Neighborhood of the address
  city_id bigint // Identifier of the city
  zip_code varchar(255) // ZIP code of the address
}

// Table to store city details
Table Cities {
  city_id bigint [primary key, increment] // Unique identifier for the city
  city_name varchar(255) // Name of the city
  state_id bigint // Identifier of the state
}

// Table to store state details
Table States {
  state_id bigint [primary key, increment] // Unique identifier for the state
  state_name varchar(255) // Name of the state
  country_id bigint // Identifier of the country
  iso_code varchar(20) // ISO code of the state
}

// Table to store country details
Table Countries {
  country_id bigint [primary key, increment] // Unique identifier for the country
  country_name varchar(255) // Name of the country
  iso_code varchar(20) // ISO code of the country
}

// Define references between tables
Ref: Users.address_id > Addresses.address_id
Ref: UserAuditLogs.user_id > Users.user_id
Ref: UserAuditLogs.action_type_id > ActionTypes.action_type_id
Ref: UserAuditLogs.login_id > UserLogins.login_id
Ref: Addresses.city_id > Cities.city_id
Ref: Cities.state_id > States.state_id
Ref: States.country_id > Countries.country_id
