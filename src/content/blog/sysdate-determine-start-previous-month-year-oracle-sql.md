---
title: 'Oracle SQL: Use sysdate for start and end of previous month and year'
date: Mon, 30 Mar 2009 22:47:59 +0000
draft: false
tags: [Database Tips, oracle]
featured: true
---

Wow, that title is a mouthful. Basically i figured out how to **use SYSDATE and some other temporal methods to automatically determine the first and last day of the previous month, or previous year**. I needed this to hand off  a canned query that can be used by many users without the need to constantly update the date parameters of the query.  For instance "**Show me sales totals for the previous month!**"  or " **What was the total number of transactions last year?**" You could just type something like

 Date >= to_date('11-01-2009', 'MM-DD-YYYY')

But that need users to change every month or year... boooo. The solutions are not too pretty, but they work, And if you have a better way I would love to hear.. Googling proved no avail, and I had to dig this combination from various pieces in an O'Reilly Oracle book. Without further delay..

Oracle SQL Query using start and end of Last Month as Dates
-----------------------------------------------------------

#### Basic Use

#### 

select TRUNC(ADD\_MONTHS(SYSDATE, -1),'MM') , LAST\_DAY(ADD_MONTHS(SYSDATE,-1)) from TABLE

#### Sample Use

#### In this example we will get the sales total by agent and region for last month.

/\*
\*  This query will retrieve all session summary records that occurred in the previous month
\* Do not adjust the date fields, it should calculate correctly based on today's date.
\*
\* @Author Eddie Webb
\*
\*/

/\* add TRUNC(ADD\_MONTHS(SYSDATE, -1),'MM') , LAST\_DAY(ADD_MONTHS(SYSDATE,-1))  to select to test dates */

select  AGENT\_NAME, REGION, SALE\_DATE, SUM(SALE_VALUE) total from TRS.SALES


where
    /\* first day of previous month*/
    /\* adjust the -1 to adjust months back */
    /\* default:   TRUNC(ADD_MONTHS(SYSDATE, -1),'MM')    */
    SALE\_DAY >= TRUNC(ADD\_MONTHS(SYSDATE, -1),'MM')
   
and
    /\*last day of last month\*/
    /\* adjust the -1 to adjust months back */
    /\* default:    LAST\_DAY(ADD\_MONTHS(SYSDATE, -1))   */
    SALE\_DAY <= LAST\_DAY(ADD_MONTHS(SYSDATE, -1))


/\* group sums by Client IDs Requestor, then system */
group by ROLLUP( AGENT\_NAME, AGENT\_NAME)

#### How's that work?

If we focus on the basic use above you'll notice two manipulations. The first one is the first day of the month.

 TRUNC(ADD_MONTHS(SYSDATE, -1),'MM') 

Start with today's date using sysdate (3/27) and subtracts one month (2/27). We then Truncate the result using MM for the numerical value of the month(2). This will represent the first day of last month (2/1). The second manipulation requires the use of LAST_DAY instead of TRUNC.

 LAST\_DAY(ADD\_MONTHS(SYSDATE, -1)) 

Start with today's date using sysdate (3/27) and subtracts one month (2/28). We then obtain the LAST\_DAY (2/28). Note: no, there isnt a FIRST\_DAY function or I would have used it. No, there isn't a SUBTRACT_MONTHS function "" "" "". **Instead you can pass positive or negative numbers to ADD_MONTHS. 0 will get the dates for the current month.**

Oracle SQL Query using start and end of Last Year as Dates
----------------------------------------------------------

OK same basic premises here but extended.

#### Basic Use

#### 

select     
TRUNC(ADD_MONTHS(SYSDATE, -12),'SYYYY'),
LAST\_DAY(ADD\_MONTHS(TRUNC(ADD_MONTHS(SYSDATE, -12),'SYYYY'), 11))
from TABLE

#### Sample Use

#### In this example we will get the sales total by agent and region for last month.

/\*
\*  This query will retrieve all session summary records that occurred in the previous YEAR
\* and provide a total count by client
\* Do not adjust the date fields, it should calculate correctly based on today's date.
\*
\* @Author Eddie Webb
*
*/



select  REQUESTOR\_ID, SYSTEM\_ID, SUM(SESSION\_COUNT) total from EBR.SESSION\_SUMM


where
    /\* first day of previous YEAR*/
    SERVICE\_DAY >= TRUNC(ADD\_MONTHS(SYSDATE, -12),'SYYYY') 
 
   
and
    /\*last day of last YEAR\*/
    SERVICE\_DAY <= LAST\_DAY(ADD\_MONTHS(TRUNC(ADD\_MONTHS(SYSDATE, -12),'SYYYY'), 11))


/\* group sums by Client IDs Requestor, then system */
group by ROLLUP( REQUESTOR\_ID, SYSTEM\_ID)

#### How's that work?

If we focus on the basic use above you'll notice two manipulations. The first one is the first day of the year, also very simialr to the first day of last month, but different.

 TRUNC(ADD_MONTHS(SYSDATE, -12),'SYYYY')  

Start with today's date using sysdate (3/27/09) and subtracts 12 months (3/27/08). We then Truncate the result using SYYYY for the numerical value of the year(2008). Again, because of TRUNC's behavior it will default to January 1st, 12:00 am of the truncated year. This will represent the first day of last year (1/1/2008). The second manipulation is ugly at best, and depends on calculating the first day of the year.

 LAST\_DAY(ADD\_MONTHS(TRUNC(ADD_MONTHS(SYSDATE, -12),'SYYYY'), 11)) 

OR

 ADD\_MONTHS(TRUNC(ADD\_MONTHS(SYSDATE, -12),'SYYYY'), 12) 

Again we start with today's date using sysdate (3/27/09) and subtracts 12 months (3/27/08). We then Truncate the result using SYYYY for the numerical value of the year(2008). Again, because of TRUNC's behavior it will default to January 1st, 12:00 am of the truncated year. This will represent the first day of last year (1/1/2008). Now we go a step further by adding 11 months to the first day of last year (12/1/2008) and finally get the last day of that month using LAST_DAY (12/31/2008 12:00 am) More Notes: Don't rely on 365 days because some years have 366 (leap years) all years however have 12 months. **You may instead consider adding 12 months to 1/1/2008, and remove the LAST_DAY function will give you 1/1/2009 12:00 am, which may be your goal... (moments after 12/31/08 11:59 pm)**