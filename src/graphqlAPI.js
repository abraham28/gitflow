function isObject(avar) {
  return (
    Object.prototype.toString.call(avar) === "[object Object]" &&
    avar.constructor.name === "Object"
  );
}

function createGqlObj(obj) {
  let shape = [];
  for (let [key, val] of Object.entries(obj))
    shape.push(
      isObject(val) ? `${key}:{${createGqlObj(val)}}` : `${key}:"${val}"`
    );
  return shape.join(",");
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://expert-lioness-29.hasura.app/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    }
  );
  return await result.json();
}

/**
 * for Creating User
 * roles: [super_admin,system_admin,company_admin,division_admin,user]
 * password can be sanitized on front-end
 */
export function createUser(userModel) {
  const { role, ...rest } = userModel;
  const createUserMutation = `
    mutation createUser {
      insert_users_one(object: {${createGqlObj(rest)},role:${role}}) {
        email
        first_name
        last_name
        password
        companies
        divisions
        role
        created_at
        updated_at
      }
    }
  `;
  return fetchGraphQL(createUserMutation, "createUser", {});
}

/**
 * For getting all users
 */
export function getUsers() {
  const getUsersQuery = `
  query getUsers {
    users {
      email
      first_name
      last_name
      companies
      divisions
      role
      created_at
      updated_at

    }
  }
  `;
  return fetchGraphQL(getUsersQuery, "getUsers", {});
}

/**
 * check user
 */
export function login(email, password) {
  const getUsersQuery = `
  query login {
    users(where: {email: {_eq: "${email}"}, password: {_eq: "${password}"}}) {
      role
      updated_at
      created_at
      email
      first_name
      last_name
      company_id
      division_id
    }
  }
  `;
  return fetchGraphQL(getUsersQuery, "login", {});
}

/**
 * For updating users
 */
export function updateUser(email, updateValues) {
  const { role, ...rest } = updateValues;
  const operationsDoc = `
    mutation updateUser {
      update_users_by_pk(
        pk_columns: {email: "${email}"}, 
        _set: {${createGqlObj(rest)}, role:${role}}
      ) {
        email
        first_name
        last_name
        role
        created_at
        updated_at
      }
    }
  `;
  return fetchGraphQL(operationsDoc, "updateUser", {});
}

/**
 * For deleting users
 */

export function deleteUser(email) {
  const deleteUserMutation = `
    mutation deleteUser {
      delete_users_by_pk(email: "${email}") {
        email
      }
    }
  `;
  return fetchGraphQL(deleteUserMutation, "deleteUser", {});
}

export function getRoles() {
  const deleteUserMutation = `
  query getRoles{
    user_role {
      value
      comment
    }
  }
  
  `;
  return fetchGraphQL(deleteUserMutation, "getRoles", {});
}

/**
 * Sample Usage
 * async function startFetchGetUsers() {
 * const { errors, data } = await getUsers();
 *
 * if (errors) {
 *   // handle those errors like a pro
 *   console.error(errors);
 * }
 *
 * // do something great with this precious data
 * console.log(data);
 * }
 */
