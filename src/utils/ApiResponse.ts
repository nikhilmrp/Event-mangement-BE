class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(data: any, message: string = "Success", statusCode: number = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data: any, message: string = "Created successfully") {
    return new ApiResponse(201, data, message);
  }
}

export default ApiResponse;
