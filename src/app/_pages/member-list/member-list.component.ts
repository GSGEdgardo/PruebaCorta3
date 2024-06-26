import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_interfaces/member';
import { MemberService } from 'src/app/_services/member.service';
import { CreateMember } from 'src/app/_interfaces/create-member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styles: [],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  addMemberModalVisible: boolean = false;
  editMemberModalVisible: boolean = false;
  confirmDeleteModalVisible: boolean = false;

  newMember: any = {
    name: '',
    email: '',
    semester: 0,
    career: '',
  };

  currentMember: any = {
    name: '',
    email: '',
    semester: 0,
    career: '',
  };

  errorMessage: string = '';
  fieldErrors: any = {};

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      },
    });
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((data) => {
      this.members = data;
    });
  }

  openAddMemberModal(): void {
    this.addMemberModalVisible = true;
  }

  closeAddMemberModal(): void {
    this.addMemberModalVisible = false;
    this.errorMessage = '';
    this.fieldErrors = {};
    this.newMember = {
      name: '',
      email: '',
      semester: '',
      career: '',
    };
  }

  addMember(): void {
    const memberForm = new FormData();
    memberForm.append('name', this.newMember.name);
    memberForm.append('email', this.newMember.email);
    memberForm.append('semester', this.newMember.semester);
    memberForm.append('career', this.newMember.career);

    this.memberService.createMember(memberForm).subscribe({
      next: (response) => {
        console.log(response);
        alert(response);
        this.loadMembers();
        this.closeAddMemberModal();
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          try {
            const errorJson = JSON.parse(err.error);
            console.log(errorJson);
          } catch (e) {
            this.errorMessage = err.errors;
          }
        } else {
          this.errorMessage = 'Unexpected error. Please try again.';
        }
        console.log('Error adding a member', err);
      },
    });
  }
}
