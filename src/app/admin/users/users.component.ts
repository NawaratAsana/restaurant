import { StatusService } from "./../../services/status.service";
import { UserService } from "./../../services/user.service";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UploadService } from "src/app/services/upload.service";
declare const $: any;
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  public items: any;
  public statuses: any;
  model = {
    userid:"",
    name: "",
    gender: "",
    address: "",
    telephone: "",
    email: "",
    username: "",
    password: "",
    statusid: "",
    picture: "",
  };
  public userid: string = "";
  file!: File;
  hasFile: boolean | undefined; //ตรวจสอบการเลือกไฟล์ว่าใช่หรือไม่
  formData = new FormData(); // ส่งค่าไปฟอร์ม
  constructor(
    private userService: UserService,
    private statusService: StatusService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    //เรียกใช้งาน userservice เพื่อ get ข้อมูล
    this.userService.getUser().subscribe((result) => {
      this.items = result;
      console.log(this.items);
    });
    // เรียกใช้งาน statusService
    this.statusService.getStatus().subscribe((result) => {
      this.statuses = result;
    });
  }
  addUser(): void {
    $("#addEmployeeModal").modal("hide");
    console.log(this.model);
    // เรียกใช้ userService เพื่อ post ข้อมูล
    this.userService.postUser(this.model)
    .subscribe((result) => {
      // upload
      if(this.hasFile){
        //ถ้ามีไฟล์รูปภาพ
        this.formData.append('picture', this.file);
        // เรียกใช้ service ในการ upload
        this.uploadService.uploadUserPictureFile(this.formData)
        .subscribe(response =>{
          console.log(response);
        });
      }
      console.log(result);
      this.ngOnInit();
    });
  }
  deleteUser(id: string): void {
    this.userid = id;
    console.log(id);
  }
  confirmDelete(): void {
    $("#deleteEmployeeModal").modal("hide");
    console.log(this.userid);
    // เรียกใช้ userservice เพื่อลบข้อมูล
    this.userService.deleteUser(this.userid).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }
  editUser(item: any): void {
    this.model = item;
  }
  updateUser(): void {
    $("#editEmployeeModal").modal("hide");
    // console.log(this.model);
    // เรียกใช้ userservice เพื่อแก้ไขข้อมูล
    this.userService.putUser(this.model)
    .subscribe((result) => {
      // upload
      if(this.hasFile){
        //ถ้ามีไฟล์รูปภาพ
        this.formData.append('picture', this.file);
        this.formData.append('userid', this.model.userid);
        // เรียกใช้ service ในการ upload
        this.uploadService.uploadUserPictureFile(this.formData)
        .subscribe(response =>{
          console.log(response);
        });
      }
      console.log(result);
      this.ngOnInit();
    });
  }
  onFlieSelect(event: any): void {
    // console.log(event.target.files[0].type);
    // ตรวจสอบว่ามีการเลือกไฟล์หรือยัง
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.model.picture = this.file.name;
      this.hasFile = true;
      this.model.picture = event.target.files[0].name;
    }
  }
}