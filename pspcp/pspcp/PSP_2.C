#include <stdio.h>

struct Fitness{
    char name[50];
    int age;
    float height;
    float weight;
    int steps[7];
    float water;
};

float calculateBMI(float w,float h){
    return w/(h*h);
}

int totalsteps(int steps[]){
    int i,sum=0;
    for(i=0;i<7;i++)
        sum+=steps[i];
    return sum;
}

int main(){
    struct Fitness user;
    int choice,i,sleep=0,junk=0;
    int profilecreated=0,stepsentered=0;
    float bmi,calories;

    do{
        printf("\n*WELCOME TO FITNESS TRACKER!*");
        printf("\n1.Create Profile\n2.Enter Steps(7 days)\n3.Weekly Calories burned\n4.Calculate your BMI\n5.Enter sleep schedule\n6.Your eating Habits\n7.Display Report\n8.Exit");
        printf("\nEnter a choice:");
        scanf("%d",&choice);

        switch(choice){

        case 1:
            printf("\nEnter Your Name:");
            scanf("%s",user.name);

            printf("\nEnter age:");
            scanf("%d",&user.age);

            printf("\nEnter Height(in meters):");
            scanf("%f",&user.height);

            printf("\nEnter Weight(in kgs):");
            scanf("%f",&user.weight);

            printf("\nEnter daily water intake(in Litres):");
            scanf("%f",&user.water);

            profilecreated=1;
            printf("\nProfile Created!");
            break;

        case 2:
            if(!profilecreated){
                printf("\nCreate Profile First!");
            }else{
                int add = 0;
                printf("\nEnter Steps for 7 days of week:");
                for(i=0;i<7;i++){
                    printf("\nDay %d: ",i+1);
                    scanf("%d",&user.steps[i]);
                    add+=user.steps[i];
                }

                stepsentered=1;

                if(add<2000)
                    printf("\nYou need to move more!");
                else if(add<15000)
                    printf("\nGood, But you can do better");
                else
                    printf("\nGreat! You are active throughout the week");
            }
            break;

        case 3:
            if(!stepsentered)
                printf("\nEnter steps first!");
            else{
                calories = totalsteps(user.steps)*0.04;
                printf("\nWeekly Calories burned: %.2f",calories);
            }
            break;

        case 4:
            if(!profilecreated)
                printf("\nCreate profile first!");
            else{
                bmi = calculateBMI(user.weight,user.height);
                printf("\nYour BMI is: %.2f",bmi);

                if(bmi < 19)
                    printf("\nUnderweight");
                else if(bmi < 25)
                    printf("\nHealthy range");
                else if(bmi < 30)
                    printf("\nOverweight");
                else
                    printf("\nObese");
            }
            break;

        case 5:
            printf("\nEnter the number of hours you sleep:");
            scanf("%d",&sleep);
            if(sleep<8)
                printf("\nYou are sleep deprived!");
            else
                printf("\nAdequate sleep");
            break;

        case 6:
            printf("\nHow many times do you eat junk food in a week?");
            scanf("%d",&junk);
            break;

        case 7:
            if(!profilecreated)
                printf("\nCreate profile first!");
            else{
                printf("\n***FITNESS REPORT***");
                printf("\nName:%s",user.name);
                printf("\nAge:%d",user.age);
                printf("\nHeight:%.2f m",user.height);
                printf("\nWeight:%.2f kg",user.weight);

                printf("\nWater intake: %.1f L",user.water);
                printf(user.water>=2.5 ? "\nWell hydrated" : "\nDrink more water");

                printf("\nSleep Time: %d hrs - %s",
                       sleep,(sleep<8?"Sleep deprived":"Adequate"));

                printf("\nJunk Food frequency per week:%d",junk);

                printf("\nSteps:");
                for(i=0;i<7;i++)
                    printf("\nDay %d: %d",i+1,user.steps[i]);
            }
            break;

        case 8:
            printf("\nExiting...Stay Fit!!");
            break;

        default:
            printf("\nInvalid input!!");
        }

    }while(choice!=8);

    return 0;
}
