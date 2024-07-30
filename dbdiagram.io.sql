// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table LoginUsers {
  login_user_id bigint [primary key, increment]
  username varchar(255)
  password varchar(255)
  status bool
  created_at timestamp 
  updated_at timestamp
}

Table Users {
  user_id bigint [primary key, increment]
  cpf varchar(11) [unique]
  nome varchar(255)
  birth_date date
  address_id bigint [unique]
  active bool
}

Table UserAudit {
  audit_id bigint [primary key, increment]
  user_id bigint
  action_type_id bigint
  action_time timestamp
  login_user_id bigint
}

Table ActionType {
  action_type_id bigint [primary key, increment]
  action_type varchar(50) [note: "create, update, delete"]
}

Table Address {
  address_id bigint [primary key, increment]
  street text
  house_number varchar(255)
  complement text
  neighborhood text
  city_id bigint
  zip_code varchar(255)
}

Table Citys {
  city_id bigint [primary key, increment]
  city_name varchar(255)
  state_id bigint
}

Table State {
  state_id bigint [primary key, increment]
  state_name varchar(255)
  country_id bigint
}

Table Country {
  country_id bigint [primary key, increment]
  country_name varchar(255)
}

Ref: Users.address_id > Address.address_id
Ref: UserAudit.user_id > Users.user_id
Ref: UserAudit.action_type_id > ActionType.action_type_id
Ref: UserAudit.login_user_id > LoginUsers.login_user_id
Ref: Address.city_id > Citys.city_id
Ref: Citys.state_id > State.state_id
Ref: State.country_id > Country.country_id

