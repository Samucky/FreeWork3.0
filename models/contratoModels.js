class Contrato {
    constructor(id, freelancerId, empresaId, proyectoId, fechaInicio, fechaFin, monto, descripcion, estado) {
        this.id = id;
        this.freelancerId = freelancerId;
        this.empresaId = empresaId;
        this.proyectoId = proyectoId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.monto = monto;
        this.descripcion = descripcion;
        this.estado = estado;
    }
}

export default Contrato;
