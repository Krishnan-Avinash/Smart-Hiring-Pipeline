package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByCompany_CompanyId(Long companyId);
    Job findByJobIdAndCreatedBy_UserName(Long jobId,String userName);
    Job findByJobId(Long jobId);

    List<Job> findByCreatedBy_UserId(Long userId);

    @Query(value = """
        SELECT * FROM jobs j
        WHERE j.job_id NOT IN (
            SELECT a.job_id
            FROM applications a
            WHERE a.candidate_id = :candidateId
        )
    """, nativeQuery = true)
    List<Job> findJobsNotAppliedByCandidate(Long candidateId);
}



