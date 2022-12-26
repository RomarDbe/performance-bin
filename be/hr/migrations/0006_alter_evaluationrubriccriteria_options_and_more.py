# Generated by Django 4.1 on 2022-12-26 08:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('hr', '0005_rename_employee_evaluation_evaluationrubriccriteria_evaluation_rubric'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='evaluationrubriccriteria',
            options={'verbose_name_plural': 'Evaluation Criterias'},
        ),
        migrations.AddField(
            model_name='employeeevaluation',
            name='evaluated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_evaluation', to=settings.AUTH_USER_MODEL),
        ),
    ]
