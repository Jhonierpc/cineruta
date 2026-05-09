// Archivo intencionalmente roto para validar branch protection.
// El PR de esta rama NO debe poder mergearse a main porque CI fallará.
// Será cerrado y la rama borrada en cuanto se confirme la barrera.

const broken: number = "this should fail typecheck";

export { broken };
