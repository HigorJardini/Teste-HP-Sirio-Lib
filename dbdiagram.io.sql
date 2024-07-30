// Define the database structure using DBML
// Docs: https://dbml.dbdiagram.io/docs

// Table to store user login information
Table UserLogins {
  login_id bigint [primary key, increment] // Unique identifier for the login
  username varchar(255) // Username
  password varchar(255) // Password
  status bool // Login status (active/inactive)
  created_at timestamp // Timestamp of when the record was created
  updated_at timestamp // Timestamp of the last update
}

// Table to store user details
Table Users {
  user_id bigint [primary key, increment] // Unique identifier for the user
  cpf varchar(11) [unique] // User's CPF (unique)
  name varchar(255) // Full name of the user
  birth_date date // User's birth date
  address_id bigint [unique] // Unique identifier for the user's address
  is_active bool // User status (active/inactive)
}

// Table to record user audit logs
Table UserAuditLogs {
  audit_id bigint [primary key, increment] // Unique identifier for the audit record
  user_id bigint // Identifier of the user associated with the action
  action_type_id bigint // Identifier of the type of action performed
  action_timestamp timestamp // Timestamp of when the action was performed
  login_id bigint // Identifier of the login user who performed the action
}

// Table to define types of actions performed
Table ActionTypes {
  action_type_id bigint [primary key, increment] // Unique identifier for the action type
  action_type varchar(50) [note: "create, update, delete"] // Type of action (create, update, delete)
}

// Table to store address details
Table Addresses {
  address_id bigint [primary key, increment] // Unique identifier for the address
  street text // Street name
  house_number varchar(255) // House number
  complement text // Address complement (optional)
  neighborhood text // Neighborhood
  city_id bigint // Identifier of the city
  zip_code varchar(255) // Address ZIP code
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
}

// Table to store country details
Table Countries {
  country_id bigint [primary key, increment] // Unique identifier for the country
  country_name varchar(255) // Name of the country
}

// References between tables
Ref: Users.address_id > Addresses.address_id
Ref: UserAuditLogs.user_id > Users.user_id
Ref: UserAuditLogs.action_type_id > ActionTypes.action_type_id
Ref: UserAuditLogs.login_id > UserLogins.login_id
Ref: Addresses.city_id > Cities.city_id
Ref: Cities.state_id > States.state_id
Ref: States.country_id > Countries.country_id