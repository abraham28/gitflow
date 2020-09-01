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

export function createCompany(companyModel) {
  const createCompanyMutation = `
    mutation createCompany {
      insert_companies_one(object: {${createGqlObj(companyModel)}}) {
        id
        name
        updated_at
        created_at
        users_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  `;
  return fetchGraphQL(createCompanyMutation, "createCompany", {});
}

export function getCompanies() {
  const getCompaniesQuery = `
  query getCompanies {
    companies {
      id
      name
      updated_at
      created_at
      divisions_aggregate {
        aggregate {
          count
        }
      }
      users_aggregate {
        aggregate {
          count
        }
      }
    }
  }
  `;
  return fetchGraphQL(getCompaniesQuery, "getCompanies", {});
}

export function updateCompany(companyId, updateValues) {
  const operationsDoc = `
    mutation updateCompany {
      update_companies_by_pk(
        pk_columns: {id: "${companyId}"}, 
        _set: {${createGqlObj(updateValues)}}
      ) {
        id
        name
        updated_at
        created_at
        users_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  `;
  return fetchGraphQL(operationsDoc, "updateCompany", {});
}

export function deleteCompany(companyId) {
  const deleteCompanyMutation = `
    mutation deleteCompany {
      delete_companies_by_pk(id: "${companyId}") {
        name
      }
    }
  `;
  return fetchGraphQL(deleteCompanyMutation, "deleteCompany", {});
}

export function createDivision(divisionModel) {
  const createDivisionMutation = `
    mutation createDivision {
      insert_companies_one(object: {${createGqlObj(divisionModel)}}) {
        id
        name
        updated_at
        created_at
        company {
          id
          name
        }
      }
    }
  `;
  return fetchGraphQL(createDivisionMutation, "createDivision", {});
}

export function getDivisions() {
  const getDivisionsQuery = `
  query getDivisions {
    divisions {
      id
      name
      updated_at
      created_at
      company {
        name
      }
      users_aggregate {
        aggregate {
          count
        }
      }
    }
  }
  `;
  return fetchGraphQL(getDivisionsQuery, "getDivisions", {});
}

// export function updateCompany(companyId, updateValues) {
//   const operationsDoc = `
//     mutation updateCompany {
//       update_companies_by_pk(
//         pk_columns: {id: "${companyId}"},
//         _set: {${createGqlObj(updateValues)}}
//       ) {
//         id
//         name
//         created_at
//         updated_at
//       }
//     }
//   `;
//   return fetchGraphQL(operationsDoc, "updateCompany", {});
// }

// export function deleteCompany(companyId) {
//   const deleteCompanyMutation = `
//     mutation deleteCompany {
//       delete_companies_by_pk(id: "${companyId}") {
//         name
//       }
//     }
//   `;
//   return fetchGraphQL(deleteCompanyMutation, "deleteCompany", {});
// }
